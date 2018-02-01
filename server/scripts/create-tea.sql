CREATE TABLE IF NOT EXISTS tea (
  ID INTEGER NOT NULL,
  NAME TEXT NOT NULL,
  TEA_CATEGORY_RID INTEGER NOT NULL REFERENCES tea_categories (ID),
  DESCRIPTION TEXT,
  INSTRUCTIONS TEXT,
  RATING INTEGER,
  CONSTRAINT tea_pk PRIMARY KEY (ID)
);

CREATE SEQUENCE IF NOT EXISTS tea_id_sequence START WITH 1;

DROP TRIGGER IF EXISTS bir_tea ON tea;
DROP FUNCTION IF EXISTS bir_tea();

CREATE FUNCTION bir_tea() RETURNS trigger as $bir_tea$
BEGIN
  IF NEW.id IS NULL THEN
    NEW.id := nextval('tea_id_sequence');
  END IF;
  RETURN NEW;
END;
$bir_tea$ LANGUAGE plpgsql;

CREATE TRIGGER bir_tea BEFORE INSERT ON tea
    FOR EACH ROW EXECUTE PROCEDURE bir_tea();


CREATE TABLE IF NOT EXISTS tea_purchase_link (
  ID INTEGER NOT NULL,
  TEA_RID INTEGER NOT NULL REFERENCES tea (ID),
  URL TEXT NOT NULL,
  PRICE NUMERIC (6, 2),
  CONSTRAINT tea_purchase_link_pk PRIMARY KEY (ID)
);

CREATE SEQUENCE IF NOT EXISTS tea_puchase_link_id_sequence START WITH 1;

DROP TRIGGER IF EXISTS bir_tea_purchase_link ON tea_purchase_link;
DROP FUNCTION IF EXISTS bir_tea_purchase_link();

CREATE FUNCTION bir_tea_purchase_link() RETURNS trigger as $bir_tea_purchase_link$
BEGIN
  IF NEW.id IS NULL THEN
    NEW.id := nextval('tea_purchase_link_id_sequence');
  END IF;
  RETURN NEW;
END;
$bir_tea_purchase_link$ LANGUAGE plpgsql;

CREATE TRIGGER bir_tea_purchase_link BEFORE INSERT ON tea_purchase_link
    FOR EACH ROW EXECUTE PROCEDURE bir_tea_purchase_link();
