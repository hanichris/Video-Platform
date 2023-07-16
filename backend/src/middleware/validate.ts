import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';

const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      params: req.params,
      query: req.query,
      body: req.body,
    });

    return next();
  } catch (err: any) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        status: 'fail',
        error: err.errors,
      });
    }
    return next(err);
  }
};

export default validate;
