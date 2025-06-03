import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
pool
  .connect()
  .then(() => {
    console.log("Db Connected");
  })
  .catch((err) => {
    console.log("Error: ", err);
  });

export default pool;
