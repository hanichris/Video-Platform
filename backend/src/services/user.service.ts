import { object, string, TypeOf } from 'zod';

// New user register model
export const registerUserModel = object({
  body: object({
    username: string({ required_error: 'Username is required' }),
    email: string({ required_error: 'Email is required' }).email(
      'Invalid email',
    ),
    password: string({ required_error: 'Password is required' })
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
    passwordConfirm: string({ required_error: 'Please confirm your password' }),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
  }),
});

// Existing user password reset model
export const resetPasswordModel = object({
  body: object({
    email: string({ required_error: 'Email is required' }).email(
      'Invalid email',
    ),
    password: string({ required_error: 'Password is required' })
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
    passwordConfirm: string({ required_error: 'Please confirm your password' }),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
  }),
});

// Existing user login model
export const loginUserModel = object({
  body: object({
    email: string({ required_error: 'Email is required' }).email(
      'Invalid email or password',
    ),
    password: string({ required_error: 'Password is required' }).min(
      8,
      'Invalid email or password',
    ),
  }),
});

export type CreateUserInput = TypeOf<typeof registerUserModel>['body'];
export type ResetPasswordInput = TypeOf<typeof resetPasswordModel>['body'];
export type LoginUserInput = TypeOf<typeof loginUserModel>['body'];
