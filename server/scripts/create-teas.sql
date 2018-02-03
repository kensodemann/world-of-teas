CREATE TABLE IF NOT EXISTS teas (
  ID INTEGER NOT NULL,
  NAME TEXT NOT NULL,
  TEA_CATEGORY_RID INTEGER NOT NULL REFERENCES tea_categories (ID),
  DESCRIPTION TEXT,
  INSTRUCTIONS TEXT,
  RATING INTEGER,
  CONSTRAINT teas_pk PRIMARY KEY (ID)
);

CREATE SEQUENCE IF NOT EXISTS tea_id_sequence START WITH 1;

DROP TRIGGER IF EXISTS bir_teas ON teas;
DROP FUNCTION IF EXISTS bir_teas();

CREATE FUNCTION bir_teas() RETURNS trigger as $bir_teas$
BEGIN
  IF NEW.id IS NULL THEN
    NEW.id := nextval('tea_id_sequence');
  END IF;
  RETURN NEW;
END;
$bir_teas$ LANGUAGE plpgsql;

CREATE TRIGGER bir_teas BEFORE INSERT ON teas
    FOR EACH ROW EXECUTE PROCEDURE bir_teas();


CREATE TABLE IF NOT EXISTS tea_purchase_links (
  ID INTEGER NOT NULL,
  TEA_RID INTEGER NOT NULL REFERENCES teas (ID),
  URL TEXT NOT NULL,
  PRICE NUMERIC (6, 2),
  CONSTRAINT tea_purchase_links_pk PRIMARY KEY (ID)
);

CREATE SEQUENCE IF NOT EXISTS tea_puchase_link_id_sequence START WITH 1;

DROP TRIGGER IF EXISTS bir_tea_purchase_links ON tea_purchase_links;
DROP FUNCTION IF EXISTS bir_tea_purchase_links();

CREATE FUNCTION bir_tea_purchase_links() RETURNS trigger as $bir_tea_purchase_links$
BEGIN
  IF NEW.id IS NULL THEN
    NEW.id := nextval('tea_purchase_link_id_sequence');
  END IF;
  RETURN NEW;
END;
$bir_tea_purchase_links$ LANGUAGE plpgsql;

CREATE TRIGGER bir_tea_purchase_links BEFORE INSERT ON tea_purchase_links
    FOR EACH ROW EXECUTE PROCEDURE bir_tea_purchase_links();
