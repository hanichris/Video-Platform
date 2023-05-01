class CustomError extends Error {
  statusCode;

  constructor(statusCode: any, message: any) {
    super();
    this.message = message;
    this.statusCode = statusCode || 'error';
  }
}

const createError = (status: any, message: any) => {
  const err: CustomError = new CustomError(status, message);
  return err;
};

export default createError;
