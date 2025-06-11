
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const { query } = await req.json();

    if (!query || typeof query !== 'string') {
      throw new Error('Query is required and must be a string');
    }

    console.log('Processing query:', query);

    const prompt = `
You are a data visualization assistant. Analyze the following natural language query and extract:
1. Chart type (pie, bar, line, table)
2. Data source (channel, sentiment, rating, time, device, app_version)
3. X-axis field (if applicable)
4. Y-axis field (if applicable)
5. Filters (if any)

Available data sources:
- channel: feedback grouped by communication channel
- sentiment: feedback grouped by sentiment (positive/negative/neutral)
- rating: feedback ratings (1-5 stars)
- time: feedback over time periods
- device: feedback grouped by device type
- app_version: feedback grouped by app version

Query: "${query}"

Respond ONLY with a JSON object in this format:
{
  "chartType": "pie|bar|line|table",
  "xAxis": "field_name",
  "yAxis": "field_name", 
  "dataSource": "channel|sentiment|rating|time|device|app_version",
  "title": "descriptive title",
  "filters": {
    "channel": "specific_channel",
    "sentiment": "positive|negative|neutral",
    "timeframe": "last_month|this_year|etc"
  }
}

Examples:
- "Show feedback by channel as pie chart" → {"chartType": "pie", "dataSource": "channel", "title": "Feedback Distribution by Channel"}
- "Display rating trends over time" → {"chartType": "line", "xAxis": "month", "yAxis": "rating", "dataSource": "time", "title": "Rating Trends Over Time"}
- "Average rating by sentiment table" → {"chartType": "table", "dataSource": "sentiment", "title": "Average Rating by Sentiment"}
- "Show app version distribution for LINE Bank" → {"chartType": "bar", "dataSource": "app_version", "title": "App Version Distribution for LINE Bank", "filters": {"channel": "LINE Bank"}}
- "jumlah row berdasarkan app version untuk LINE Bank" → {"chartType": "bar", "dataSource": "app_version", "title": "Row Count by App Version for LINE Bank", "filters": {"channel": "LINE Bank"}}
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a data visualization assistant that converts natural language queries into structured data visualization parameters. Always respond with valid JSON only.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    console.log('OpenAI response:', content);

    // Parse the JSON response
    let parsedResult;
    try {
      // Clean up the response - remove any markdown formatting
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedResult = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', content);
      throw new Error('Invalid JSON response from OpenAI');
    }

    // Validate the parsed result
    const requiredFields = ['chartType', 'dataSource', 'title'];
    for (const field of requiredFields) {
      if (!parsedResult[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Ensure chartType is valid
    const validChartTypes = ['pie', 'bar', 'line', 'table'];
    if (!validChartTypes.includes(parsedResult.chartType)) {
      parsedResult.chartType = 'table'; // fallback
    }

    console.log('Parsed result:', parsedResult);

    return new Response(JSON.stringify(parsedResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in parse-natural-language-query function:', error);
    
    // Return a fallback response instead of an error
    const fallbackResponse = {
      chartType: 'table',
      dataSource: 'channel',
      title: 'Data Overview',
      error: error.message
    };

    return new Response(JSON.stringify(fallbackResponse), {
      status: 200, // Return 200 with error info instead of 500
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
