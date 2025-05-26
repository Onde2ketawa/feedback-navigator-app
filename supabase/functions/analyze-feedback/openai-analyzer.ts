
import { openAIApiKey } from "./config.ts";

export async function analyzeWithOpenAI(feedback: string): Promise<{ sentiment: string; score: number }> {
  if (!openAIApiKey) {
    throw new Error("OPENAI_API_KEY is not set in environment variables");
  }

  const prompt = [
    {
      role: "system",
      content:
        'Analyze the sentiment of this customer feedback. Respond ONLY with a JSON object containing "sentiment" (positive/neutral/negative) and "score" (-1 to 1). Example: {"sentiment": "positive", "score": 0.8}',
    },
    {
      role: "user",
      content: feedback,
    },
  ];

  const body = {
    model: "gpt-4o-mini",
    messages: prompt,
    temperature: 0.2,
    max_tokens: 50,
  };

  const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAIApiKey}`,
    },
    body: JSON.stringify(body),
  });
  
  if (!aiRes.ok) {
    console.error(`OpenAI API error: ${aiRes.status} ${await aiRes.text()}`);
    throw new Error(`OpenAI API returned ${aiRes.status}`);
  }

  const aiJson = await aiRes.json();
  const content = aiJson.choices?.[0]?.message?.content ?? "";
  
  try {
    let jsonText = content;
    
    const jsonMatch = content.match(/```(?:json)?(.*?)```/s);
    if (jsonMatch && jsonMatch[1]) {
      jsonText = jsonMatch[1].trim();
    }
    
    const jsonStartPos = jsonText.indexOf('{');
    const jsonEndPos = jsonText.lastIndexOf('}');
    
    if (jsonStartPos !== -1 && jsonEndPos !== -1 && jsonEndPos > jsonStartPos) {
      jsonText = jsonText.substring(jsonStartPos, jsonEndPos + 1);
    }
    
    const jsonResp = JSON.parse(jsonText);
    
    if (
      ["positive", "neutral", "negative"].includes(jsonResp.sentiment) &&
      typeof jsonResp.score === "number"
    ) {
      return {
        sentiment: jsonResp.sentiment,
        score: Math.max(-1, Math.min(1, Number(jsonResp.score)))
      };
    } else {
      console.log(`Invalid sentiment data in response: ${JSON.stringify(jsonResp)}`);
      throw new Error("Invalid OpenAI response format");
    }
  } catch (parseError) {
    console.error(`Failed to parse OpenAI response: ${parseError.message}`, content);
    throw parseError;
  }
}
