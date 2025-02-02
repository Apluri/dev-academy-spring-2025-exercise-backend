CREATE VIEW "dailyElectricityStatistics" AS
SELECT
  "date",
  SUM("productionamount") AS "totalProduction",
  SUM("consumptionamount") AS "totalConsumption",
  AVG("hourlyprice") AS "averagePrice",
  (
    SELECT MAX("streak_count") FROM (
      SELECT
        inner_data."date",
        SUM(CASE WHEN inner_data."hourlyprice" < 0 THEN 1 ELSE 0 END)
          OVER (PARTITION BY inner_data."date" ORDER BY inner_data."starttime"
          ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS "streak_count"
      FROM "electricitydata" inner_data
      WHERE inner_data."date" = outer_data."date"
    ) AS "streaks"
  ) AS "longestNegativePriceStreak"
FROM "electricitydata" outer_data
GROUP BY "date";
