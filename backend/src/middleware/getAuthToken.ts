import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { exclude } from '../controllers/auth.controller';
import User from '../models/user.model';

// Get token from request header or from cookie to authenticate user
const getAuthToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token;
    if (
      req.headers.authorization
      && req.headers.authorization.startsWith('Bearer')
    ) {
      /* eslint prefer-destructuring: ["error", {AssignmentExpression: {array: false}}] */
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.auth_token) {
      token = req.cookies.auth_token;
    }

    if (!token) {
      return res.status(401).json({
        message: 'You are not logged in',
      });
    }

    const JWT_SECRET = process.env.JWT_SECRET as unknown as string;
    const decodedCredentials = jwt.verify(token, JWT_SECRET);

    if (!decodedCredentials) {
      return res.status(401).json({
        message: "Invalid token or user doesn't exist",
      });
    }
    const user: any = await User.findById(decodedCredentials.sub);

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'User with that token no longer exist',
      });
    }

    res.locals.user = exclude(user._doc, ['password']);
    return next();
  } catch (err: any) {
    return next(err);
  }
};

export default getAuthToken;
