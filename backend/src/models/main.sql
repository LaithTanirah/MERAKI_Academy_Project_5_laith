CREATE TABLE "uesrs" (
  "user_id" SERIAL PRIMARY KEY,
  "first_name" varchar,
  "last_name" varchar,
  "email" varchar,
  "password" varchar,
  "phoneNumber" integer,
  "deleted_at" timestamp
);

CREATE TABLE "locations" (
  "locations_id" SERIAL PRIMARY KEY,
  "locations_name" varchar,
  "location" Point
);

CREATE TABLE "category" (
  "category_id" SERIAL PRIMARY KEY,
  "category_name" varchar,
  "deleted_at" timestamp
);

CREATE TABLE "products" (
  "product_id" SERIAL PRIMARY KEY,
  "product_title" varchar,
  "product_description" varchar,
  "product_price" double,
  "product_size" varchar[],
  "deleted_at" timestamp
);

CREATE TABLE "cart" (
  "cart_id" SERIAL PRIMARY KEY,
  "cart_products" integer,
  "deleted_at" timestamp
);

CREATE TABLE "favorite" (
  "favorite_id" SERIAL PRIMARY KEY,
  "favorite_products" integer
);

CREATE TABLE "orders" (
  "order_id" SERIAL PRIMARY KEY,
  "cart_id" integer,
  "status" varchar
);

CREATE TABLE "role" (
  "role_id" SERIAL PRIMARY KEY,
  "permission" varchar
);

ALTER TABLE "locations" ADD CONSTRAINT "locations_uesrs" FOREIGN KEY ("locations_id") REFERENCES "uesrs" ("user_id");

ALTER TABLE "cart" ADD CONSTRAINT "cart_uesrs" FOREIGN KEY ("cart_id") REFERENCES "uesrs" ("user_id");

ALTER TABLE "orders" ADD CONSTRAINT "order_uesrs" FOREIGN KEY ("order_id") REFERENCES "uesrs" ("user_id");

ALTER TABLE "role" ADD CONSTRAINT "role_uesrs" FOREIGN KEY ("role_id") REFERENCES "uesrs" ("user_id");

ALTER TABLE "favorite" ADD CONSTRAINT "favorite_uesrs" FOREIGN KEY ("favorite_id") REFERENCES "uesrs" ("user_id");

ALTER TABLE "products" ADD CONSTRAINT "product_category" FOREIGN KEY ("product_id") REFERENCES "category" ("category_id");

ALTER TABLE "products" ADD CONSTRAINT "product_cart" FOREIGN KEY ("product_id") REFERENCES "cart" ("cart_id");

ALTER TABLE "products" ADD CONSTRAINT "product_favorite" FOREIGN KEY ("product_id") REFERENCES "favorite" ("favorite_id");

ALTER TABLE "orders" ADD CONSTRAINT "order_cart" FOREIGN KEY ("cart_id") REFERENCES "cart" ("cart_id");
