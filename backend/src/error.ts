class CustomError extends Error {
    status;
    constructor(status: any, message: any) {
        super();
        this.message = message;
        this.status = status || "error";
    }
}

const createError = (status: any, message: any) => {
    const err: CustomError = new CustomError(status, message);
    return err
}

export default createError;