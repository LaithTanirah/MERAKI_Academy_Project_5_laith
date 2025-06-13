import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  token?: string | JwtPayload;
}

const authentication = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(403).json({
        success: false,
        message: "Forbidden",
      });
      return;
    }

    const token = authHeader.split(" ").pop();

    if (!token) {
      res.status(403).json({
        success: false,
        message: "Token not provided",
      });
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        res.status(403).json({
          success: false,
          message: "The token is invalid or expired",
        });
      } else {
        req.token = decoded;
        next();
      }
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      err: err.message,
    });
  }
};

export default authentication;
