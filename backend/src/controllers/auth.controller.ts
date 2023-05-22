import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { CreateUserInput, LoginUserInput } from '../services/user.service';
import {
  getGoogleOauthToken,
  getGoogleUser,
} from '../services/session.service';
import User from '../models/user.model';
import createError from '../error';
import { ChannelModel as Channel } from '../models/channel.model';

function exclude<User, Key extends keyof User>(
  user: User,
  keys: Key[],
): Omit<User, Key> {
  const modifiedUser = { ...user };
  for (const key of keys) {
    delete modifiedUser[key];
  }
  return modifiedUser;
}

const DEFAULT_AVATAR = process.env.DEFAULT_AVATAR as string;

class AuthController {
  static async registerHandler(
    req: Request<object, object, CreateUserInput>,
    resp: Response,
    next: NextFunction,
  ) {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      const user = new User({
        ...req.body,
        password: hash,
        avatar: DEFAULT_AVATAR,
      });
      await user.save();

      // create default channel
      const channel = new Channel({
        name: randomUUID(),
        userId: user._id,
        imgUrl: user.avatar,
      });
      if (!channel) {
        return next(
          createError(404, 'Default User Channel could not be created!'),
        );
      }
      await channel.save();
      user.channels.push(channel);
      await user.save();

      const TOKEN_EXPIRES_IN = process.env
        .TOKEN_EXPIRES_IN as unknown as number;
      const TOKEN_SECRET = process.env.JWT_SECRET as unknown as string;
      const token = jwt.sign({ sub: user.id }, TOKEN_SECRET, {
        expiresIn: `${TOKEN_EXPIRES_IN}m`,
      });

      resp.cookie('auth_token', token, {
        expires: new Date(Date.now() + TOKEN_EXPIRES_IN * 60 * 1000),
        httpOnly: true,
      });

      return resp.status(201).json({
        status: 'success',
        data: {
          user: exclude(user, ['password']),
        },
      });
    } catch (err: any) {
      if (err.code === 'P2002') {
        return resp.status(409).json({
          status: 'fail',
          message: 'Email already exist',
        });
      }
      return next(err);
    }
  }

  static async loginHandler(
    req: Request<object, object, LoginUserInput>,
    resp: Response,
    next: NextFunction,
  ) {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) return next(createError(404, 'User not found!'));
      if (user.fromGoogle) {
        return resp.status(401).json({
          status: 'fail',
          message: 'Use Google OAuth2 instead',
        });
      }

      if (!user.password) return next(createError(400, 'Invalid user!'));
      const isCorrect = await bcrypt.compare(req.body.password, user.password);

      if (!isCorrect) return next(createError(400, 'Wrong Credentials!'));

      const TOKEN_EXPIRES_IN = process.env
        .TOKEN_EXPIRES_IN as unknown as number;
      const TOKEN_SECRET = process.env.JWT_SECRET as unknown as string;
      const token = jwt.sign({ sub: user.id }, TOKEN_SECRET, {
        expiresIn: `${TOKEN_EXPIRES_IN}m`,
      });

      resp.cookie('auth_token', token, {
        expires: new Date(Date.now() + TOKEN_EXPIRES_IN * 60 * 1000),
        httpOnly: true,
      });

      return resp.status(200).json({
        status: 'success',
      });
    } catch (err: any) {
      return next(err);
    }
  }

  static async logoutHandler(req: Request, res: Response, next: NextFunction) {
    try {
      res.cookie('auth_token', '', { maxAge: -1 });
      res.status(200).json({ status: 'success' });
    } catch (err: any) {
      next(err);
    }
  }

  static async resetPasswordHandler(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res.status(401).json({
          status: 'fail',
          message: 'Invalid user email',
        });
      }

      if (user.fromGoogle) {
        return res.status(401).json({
          status: 'fail',
          message: 'Use Google OAuth2 instead',
        });
      }
      if (!user.password) return next(createError(400, 'Invalid user!'));
      const isUsed = await bcrypt.compare(req.body.password, user.password);
      if (isUsed) return next(createError(400, 'Use new Credentials!'));

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      user.password = hash;
      await user.save();

      const TOKEN_EXPIRES_IN = Number(process.env.TOKEN_EXPIRES_IN);
      const TOKEN_SECRET = process.env.JWT_SECRET as string;
      const token = jwt.sign({ sub: user.id }, TOKEN_SECRET, {
        expiresIn: `${TOKEN_EXPIRES_IN}m`,
      });

      res.cookie('auth_token', token, {
        expires: new Date(Date.now() + TOKEN_EXPIRES_IN * 60 * 1000),
        httpOnly: true,
      });

      return res.status(200).json({
        status: 'success',
      });
    } catch (err: any) {
      return next(err);
    }
  }

  static async googleOauthHandler(req: Request, res: Response) {
    const FRONTEND_ENDPOINT = process.env.FRONTEND_ENDPOINT as string;

    try {
      const code = req.query.code as string;
      const pathUrl = (req.query.state as string) || '/';

      if (!code) {
        return res.status(401).json({
          status: 'fail',
          message: 'Authorization code not provided!',
        });
      }
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { id_token, access_token } = await getGoogleOauthToken({ code });

      const {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        verified_email,
        email,
        picture,
      } = await getGoogleUser({
        id_token,
        access_token,
      });

      if (!verified_email) {
        return res.status(403).json({
          status: 'fail',
          message: 'Google account not verified',
        });
      }

      const user = await User.findOneAndUpdate(
        { email },

        {
          createdAt: new Date(),
          username: email,
          email,
          avatar: picture || DEFAULT_AVATAR,
          password: '',
          verified: true,
          fromGoogle: true,
        },
        {
          new: true,
          upsert: true,
        },
      );

      if (!user) return res.redirect(`${FRONTEND_ENDPOINT}/oauth/error`);

      // create default channel if one is not found
      if (user.channels.length === 0) {
        const channel = new Channel({
          name: randomUUID(),
          userId: user._id,
          imgUrl: user.avatar,
        });
        if (!channel) return res.redirect(`${FRONTEND_ENDPOINT}/oauth/error`);
        await channel.save();
        user.channels.push(channel);
        await user.save();
      }

      const TOKEN_EXPIRES_IN = Number(process.env.TOKEN_EXPIRES_IN);
      const TOKEN_SECRET = process.env.JWT_SECRET as string;
      const token = jwt.sign({ sub: user.id }, TOKEN_SECRET, {
        expiresIn: `${TOKEN_EXPIRES_IN}m`,
      });

      res.cookie('auth_token', token, {
        expires: new Date(Date.now() + TOKEN_EXPIRES_IN * 60 * 1000),
        httpOnly: true,
      });

      return res.redirect(`${FRONTEND_ENDPOINT}${pathUrl}`);
    } catch (err: any) {
      console.log('Failed to authorize Google User', err);
      return res.redirect(`${FRONTEND_ENDPOINT}/oauth/error`);
    }
  }
}
export { AuthController, exclude };
