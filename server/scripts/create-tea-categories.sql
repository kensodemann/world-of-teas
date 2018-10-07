CREATE TABLE IF NOT EXISTS tea_categories (
  ID INTEGER NOT NULL,
  NAME TEXT NOT NULL,
  DESCRIPTION TEXT NOT NULL,
  CONSTRAINT tea_categories_pk PRIMARY KEY (ID)
);

WITH data AS (
  SELECT 1 AS ID, 'Green' AS NAME, 'Green teas have the oxidation process stopped very early on, leaving them with a very subtle flavor and complex undertones. These teas should be steeped at lower temperatures for shorter periods of time.' AS DESCRIPTION
   UNION ALL
  SELECT 2 AS ID, 'Black' AS NAME, 'A fully oxidized tea, black teas have a dark color and a full robust and pronounced flavor. Blad teas tend to have a higher caffeine content than other teas.' AS DESCRIPTION
   UNION ALL
  SELECT 3 AS ID, 'Herbal' AS NAME, 'Herbal infusions are not actually "tea" but are more accurately characterized as infused beverages consisting of various dried herbs, spices, and fruits.' AS DESCRIPTION
   UNION ALL
  SELECT 4 AS ID, 'Oolong' AS NAME, 'Oolong teas are partially oxidized, giving them a flavor that is not as robust as black teas but also not as suble as green teas. Oolong teas often have a flowery fragrance.' AS DESCRIPTION
   UNION ALL
  SELECT 5 AS ID, 'Dark' AS NAME, 'From the Hunan and Sichuan provinces of China, dark teas are flavorful aged probiotic teas that steeps up very smooth with slightly sweet notes.' AS DESCRIPTION
   UNION ALL
  SELECT 6 AS ID, 'Puer' AS NAME, 'An aged black tea from china. Puer teas have a strong rich flavor that could be described as "woody" or "peaty."' AS DESCRIPTION
   UNION ALL
  SELECT 7 AS ID, 'White' AS NAME, 'White tea is produced using very young shoots with no oxidation process. White tea has an extremely delicate flavor that is sweet and fragrent. White tea should be steeped at lower temperatures for short periods of time.' AS DESCRIPTION
   UNION ALL
  SELECT 8 AS ID, 'Yellow' AS NAME, 'A rare tea from China, yellow tea goes through a similar shortened oxidation process like green teas. Yellow teas, however, do not have the grassy flavor that green teas tend to have. The leaves often resemble the shoots of white teas, but are slightly oxidized.' AS DESCRIPTION
) INSERT INTO tea_categories (ID, NAME, DESCRIPTION)
SELECT ID, NAME, DESCRIPTION FROM data
ON CONFLICT (ID) DO UPDATE
   SET NAME = EXCLUDED.NAME,
       DESCRIPTION = EXCLUDED.DESCRIPTION;
