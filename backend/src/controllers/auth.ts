import { Request, Response } from "express";
import pool from "../models/connectDB";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { error } from "console";

dotenv.config();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // bring field  from body
    const { first_name, last_name, email, password, phone_number } = req.body;

    //Check that required fields exist
    if (!first_name || !last_name || !email || !password) {
      res.status(400).json({
        error: "please fill Requsted field ",
      });
      return;
    }

    //Check email already exist ? if its not !
    const checkUserEmail = "SELECT * FROM uesrs WHERE email = $1";
    const userExistResult = await pool.query(checkUserEmail, [email]);

    if (userExistResult.rows.length > 0) {
      // if we found emaild used in same email
      res.status(400).json({ error: "Email user Before " });
      return;
    }

    // create bcrypt.js
    const salt = bcrypt.genSaltSync();

    // split the hash
    const hashedPassword = bcrypt.hashSync(password, salt);

    // inser newUser
    const insertUser = `
    INSERT INTO uesrs (first_name, last_name, email, password, "phoneNumber")
    VALUES ($1,$2,$3,$4,$5)
    RETURNING user_id, first_name, last_name, email
  `;

    const values = [
      first_name,
      last_name,
      email,
      hashedPassword,
      phone_number || null,
    ];

    const newUserResult = await pool.query(insertUser, values);
    const newUser = newUserResult.rows[0];

    // create jwt token after register
    const jwtSecret: string = process.env.JWT_SECRET || "";
    const expiresIn: string = process.env.JWT_EXPIRES_IN || "1h";

    if (!jwtSecret) {
      res.status(500).json({ error: "JWT_SECRET UNDEFINED" });
      return;
    }

    const token = Jwt.sign({ userId: newUser.user_id }, jwtSecret, {
      expiresIn: expiresIn,
    });

    // RETURN SUCCESS DATA WITH OUT PASSWORD
    res.status(201).json({
      message: "register successfully ",
      user: {
        user_id: newUser.user_id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
      },
      token,
    });
    return;
  } catch (error: any) {
    console.log("Register", error);
    res.status(500).json({ error: "Erorr during register please try later.." });
    return;
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // bring Email password
    const { email, password } = req.body;

    //Check email password
    if (!email || !password) {
      res.status(400).json({ error: "please fill Email or password" });
      return;
    }

    // search
    const findUser = "SELECT * FROM uesrs WHERE email = $1";
    const userResult = await pool.query(findUser, [email]);

    if (userResult.rows.length === 0) {
      //if you are not already user
      res.status(400).json({ error: "data wrong" });
      return;
    }

    const user = userResult.rows[0];

    // compare password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      // if not match
      res.status(400).json({ error: "Data login wrong!" });
      return;
    }

    //after check Pass
    const jwtSecret: string = process.env.JWT_SECRET || "";
    const expiresIn: string = process.env.JWT_EXPIRES_IN || "1h";

    if (!jwtSecret) {
      res.status(500).json({ error: "Not defined" });
      return;
    }

    const token = Jwt.sign({ userId: user.user_id }, jwtSecret, {
      expiresIn: expiresIn,
    });

    //return without password
    res.status(200).json({
      message: "login succesfuly",
      user: {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
      token,
    });
    return;
  } catch (error: any) {
    // if there is wrong
    console.error("❌:", error);
    res.status(500).json({ error: "Wrong during login" });
    return;
  }
};
