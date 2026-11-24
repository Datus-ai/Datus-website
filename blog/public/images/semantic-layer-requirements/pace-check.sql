-- Synthetic example: these are not my recorded runs.
WITH observations(pace_time_s, pace_distance_m) AS (
  VALUES (600.0, 2000.0), (2880.0, 8000.0), (NULL, 1000.0)
), eligible AS (
  SELECT * FROM observations
  WHERE pace_time_s IS NOT NULL AND pace_time_s > 0
    AND pace_distance_m IS NOT NULL AND pace_distance_m > 0
)
SELECT
  AVG(1000.0 * pace_time_s / pace_distance_m) AS mean_of_run_paces,
  1000.0 * SUM(pace_time_s)
    / NULLIF(SUM(pace_distance_m), 0) AS period_pace_s_per_km
FROM eligible;
