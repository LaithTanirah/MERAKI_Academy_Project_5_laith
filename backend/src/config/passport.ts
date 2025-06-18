import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from "../models/connectDB";
import dotenv from "dotenv";
import JWT from "jsonwebtoken";

dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const JWT_SECRET = process.env.JWT_SECRET!;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        const first_name = profile.name?.givenName || "Google";
        const last_name = profile.name?.familyName || "User";

        const { rows: existing } = await pool.query(
          `SELECT id, first_name, last_name, email FROM users WHERE email = $1`,
          [email]
        );

        let user;
        if (existing.length) {
          user = existing[0];
        } else {
          const insertRes = await pool.query(
            `INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, email`,
            [first_name, last_name, email, "GOOGLE_LOGIN"]
          );
          user = insertRes.rows[0];

          await pool.query(`INSERT INTO cart (user_id, status) VALUES ($1, 'ACTIVE')`, [user.id]);
        }

        const token = JWT.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

        done(null, { user, token });
      } catch (err) {
        done(err, undefined);
      }
    }
  )
);

export default passport;
