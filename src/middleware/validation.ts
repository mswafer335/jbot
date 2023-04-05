import { NextFunction, Request, Response } from "express";
import { plainToClass, plainToInstance } from "class-transformer";

import { validate } from "class-validator";
export * from "class-validator";
export const validationPipe = async (schema: new () => {}, requestObject: object) => {
    const transformedClass: any = plainToInstance(schema, requestObject);
    const errors = await validate(transformedClass);
    if (errors.length > 0) {
        return errors;
    }
    return true;
};
export const validationAndParseMiddleware = (validationSchema: any) => async (req: Request, res: Response, next: NextFunction) => {
    ///	console.log({ validationMiddleware: "run" });
    const body = { ...req.body, ...req.query };
    //console.log({ validationMiddleware: { body } });
    const result: any = await validationPipe(validationSchema, body);
    //console.log({ validationMiddleware: { result } });
    if (result !== true) {
        console.log(result);
        return res.status(400).json({
            success: false,
            ...result,
        });
    }
    let dto = plainToClass(validationSchema, body);
    req.body = { ...dto, ...req.params };
    next();
    return true;
};
