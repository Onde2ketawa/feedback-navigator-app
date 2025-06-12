
-- Fix the get_sentiment_trend_by_month function to properly handle channel filtering
CREATE OR REPLACE FUNCTION public.get_sentiment_trend_by_month(channel_name text DEFAULT NULL::text)
RETURNS TABLE(month_short text, month_num integer, year integer, positive_count bigint, neutral_count bigint, negative_count bigint, total_count bigint)
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  IF channel_name IS NULL OR channel_name = 'all' THEN
    RETURN QUERY
      SELECT 
        TO_CHAR(submit_date, 'Mon') AS month_short,
        EXTRACT(MONTH FROM submit_date)::INTEGER AS month_num,
        EXTRACT(YEAR FROM submit_date)::INTEGER AS year,
        COUNT(*) FILTER (WHERE sentiment ILIKE 'positive')::bigint AS positive_count,
        COUNT(*) FILTER (WHERE sentiment ILIKE 'neutral')::bigint AS neutral_count,
        COUNT(*) FILTER (WHERE sentiment ILIKE 'negative')::bigint AS negative_count,
        COUNT(*)::bigint AS total_count
      FROM customer_feedback
      WHERE submit_date IS NOT NULL
      GROUP BY year, month_short, month_num
      ORDER BY year, month_num;
  ELSE
    RETURN QUERY
      SELECT 
        TO_CHAR(cf.submit_date, 'Mon') AS month_short,
        EXTRACT(MONTH FROM cf.submit_date)::INTEGER AS month_num,
        EXTRACT(YEAR FROM cf.submit_date)::INTEGER AS year,
        COUNT(*) FILTER (WHERE cf.sentiment ILIKE 'positive')::bigint AS positive_count,
        COUNT(*) FILTER (WHERE cf.sentiment ILIKE 'neutral')::bigint AS neutral_count,
        COUNT(*) FILTER (WHERE cf.sentiment ILIKE 'negative')::bigint AS negative_count,
        COUNT(*)::bigint AS total_count
      FROM customer_feedback cf
      JOIN channel c ON cf.channel_id = c.id
      WHERE c.name = channel_name AND cf.submit_date IS NOT NULL
      GROUP BY year, month_short, month_num
      ORDER BY year, month_num;
  END IF;
END;
$function$
