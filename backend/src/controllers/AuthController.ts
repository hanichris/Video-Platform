import { NextFunction, Request, Response } from "express";
import { CreateUserInput, LoginUserInput } from "../services/user.service";
import {
  getGoogleOauthToken,
  getGoogleUser,
} from "../services/session.service";
import jwt from "jsonwebtoken";
import User from "../models/user.model"
import bcrypt from "bcryptjs";
import createError from "../error";

function exclude<User, Key extends keyof User>(
  user: User,
  keys: Key[]
): Omit<User, Key> {
  for (let key in keys) {
    delete user[key];
  }
  return user;
}

const DEFAULT_THUMBNAIL = process.env.DEFAULT_THUMBNAIL as unknown as string;

class AuthController {
  static async registerHandler(
    req: Request<{}, {}, CreateUserInput>,
    resp: Response,
    next: NextFunction
  ) {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      const user = new User({
          ...req.body,
          "password": hash,
          "avatar": DEFAULT_THUMBNAIL,
      });
      await user.save();
      const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN as unknown as number;
      const TOKEN_SECRET = process.env.JWT_SECRET as unknown as string;
      const token = jwt.sign({ sub: user.id }, TOKEN_SECRET);
      resp.cookie("auth_token", token, {
        expires: new Date(Date.now() + TOKEN_EXPIRES_IN * 60 * 1000),
      });
      resp.status(201).json({
        status: "success",
        data: {
          user: exclude(user, ["password"]),
        },
      });
    } catch (err: any) {
      if (err.code === "P2002") {
        return resp.status(409).json({
          status: "fail",
          message: "Email already exist",
        });
      }
      next(err);
    }
  };

  static async loginHandler (
    req: Request<{}, {}, LoginUserInput>,
    resp: Response,
    next: NextFunction
  ) {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) return next(createError(404, "User not found!"));
      if (user.fromGoogle) {
        return resp.status(401).json({
          status: "fail",
          message: `Use Google OAuth2 instead`,
        });
      }

      if (!user.password) return next(createError(400, "Invalid user!"));
      const isCorrect = await bcrypt.compare(req.body.password, user.password);

      if (!isCorrect) return next(createError(400, "Wrong Credentials!"));

      const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN as unknown as number;
      const TOKEN_SECRET = process.env.JWT_SECRET as unknown as string;
      const token = jwt.sign({ sub: user.id }, TOKEN_SECRET);

      resp.cookie("auth_token", token, {
        expires: new Date(Date.now() + TOKEN_EXPIRES_IN * 60 * 1000),
      });

      resp.status(200).json({
        status: "success",
      });
    } catch (err: any) {
      next(err);
    }
  };

  static async logoutHandler (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      res.cookie("auth_token", "", { maxAge: -1 });
      res.status(200).json({ status: "success" });
    } catch (err: any) {
      next(err);
    }
  };

  static async resetPasswordHandler (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res.status(401).json({
          status: "fail",
          message: "Invalid user email",
        });
      }

      if (user.fromGoogle) {
        return res.status(401).json({
          status: "fail",
          message: `Use Google OAuth2 instead`,
        });
      }
      if (!user.password) return next(createError(400, "Invalid user!"));
      const isUsed = await bcrypt.compare(req.body.password, user.password)
      if (isUsed) return next(createError(400, "Use new Credentials!"));

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      user.password = hash;
      user.save();

      const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN as unknown as number;
      const TOKEN_SECRET = process.env.JWT_SECRET as unknown as string;
      const token = jwt.sign({ sub: user.id }, TOKEN_SECRET);

      res.cookie("auth_token", token, {
        expires: new Date(Date.now() + TOKEN_EXPIRES_IN * 60 * 1000),
      });

      res.status(200).json({
        status: "success",
      });
    } catch (err: any) {
      next(err);
    }
  };

  static async googleOauthHandler (req: Request, res: Response) {
    const FRONTEND_ENDPOINT = process.env.FRONTEND_ENDPOINT as unknown as string;

    try {
      const code = req.query.code as string;
      const pathUrl = (req.query.state as string) || "/";

      if (!code) {
        return res.status(401).json({
          status: "fail",
          message: "Authorization code not provided!",
        });
      }

      const { id_token, access_token } = await getGoogleOauthToken({ code });

      const { name, verified_email, email, picture } = await getGoogleUser({
        id_token,
        access_token,
      });

      if (!verified_email) {
        return res.status(403).json({
          status: "fail",
          message: "Google account not verified",
        });
      }

      const user = await User.findOneAndUpdate({ email },
        {
          createdAt: new Date(),
          username: email,
          email,
          avatar: picture || DEFAULT_THUMBNAIL,
          password: "",
          verified: true,
          fromGoogle: true,
        },
        {
          new: true,
          upsert: true
        }
      );

      if (!user) return res.redirect(`${FRONTEND_ENDPOINT}/oauth/error`);

      const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN as unknown as number;
      const TOKEN_SECRET = process.env.JWT_SECRET as unknown as string;
      const token = jwt.sign({ sub: user.id }, TOKEN_SECRET, {
        expiresIn: `${TOKEN_EXPIRES_IN}m`,
      });

      res.cookie("auth_token", token, {
        expires: new Date(Date.now() + TOKEN_EXPIRES_IN * 60 * 1000),
      });

      res.redirect(`${FRONTEND_ENDPOINT}${pathUrl}`);
    } catch (err: any) {
      console.log("Failed to authorize Google User", err);
      return res.redirect(`${FRONTEND_ENDPOINT}/oauth/error`);
    }
  };
}
export { AuthController, exclude }