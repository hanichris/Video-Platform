import { NextFunction, Request, Response } from "express";

// Read from the local response object to get the stored user json data
// for endpoints that require a logged in user
export const requireLogin = (
  req: Request,
  resp: Response,
  next: NextFunction
) => {
  try {
    const user = resp.locals.user;
    if (!user) {
      return resp.status(401).json({
        status: "fail",
        message: "Invalid token or session has expired",
      });
    }
    next();
  } catch (err: any) {
    next(err);
  }
};
