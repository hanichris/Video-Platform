import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { exclude } from "../controllers/AuthController";
import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import sha1 from 'sha1';

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in",
      });
    }

    const JWT_SECRET = process.env.JWT_SECRET as unknown as string;
    const decodedCredentials = jwt.verify(token, JWT_SECRET);

    if (!decodedCredentials) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid token or user doesn't exist",
      });
    }

    const user = await dbClient.getUser(
      { email: String(decodedCredentials.sub),
        password: sha1(userPwd) }
    );

    // const user = await prisma.user.findUnique({
    //   where: { id: String(decodedCredentials.sub) },
    // });

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "User with that token no longer exist",
      });
    }

    res.locals.user = exclude(user, ["password"]);
    

    next();
  } catch (err: any) {
    next(err);
  }
};
