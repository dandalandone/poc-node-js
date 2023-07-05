import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

interface myError extends Error {
    code?: number,
    keyValue: string,
    errors: string,
    statusCode: StatusCodes,
}

const errorHandlerMiddleware = (err: myError , req: Request, res: Response, next: NextFunction) => {

    // console.log(err.message)
    const defaultError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong, try again later'
    }

    if (err.name === 'ValidationError') {
        defaultError.statusCode = StatusCodes.BAD_REQUEST,
        defaultError.msg = err.message
        // defaultError.msg = Object.values(err.errors).map((item) => item.message).join(',')
    }

    // email already taken
    if (err.code && err.code === 11000) {
        defaultError.statusCode = StatusCodes.BAD_REQUEST,
        defaultError.msg = `${Object.keys(err.keyValue)} already in use`
    }
    // res.status(defaultError.statusCode).json({ msg: err })
    res.status(defaultError.statusCode).json({ msg: defaultError.msg })
}

export default errorHandlerMiddleware;