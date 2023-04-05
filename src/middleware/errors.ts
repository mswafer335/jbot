import { ErrorRequestHandler, RequestHandler } from 'express'

export const notFound: RequestHandler = (req, res) => {
    res.sendStatus(404)
}

export const internalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let jwtErrorCodes = [
        'invalid_token',
        'credentials_required',
        'permission_denied'
    ]
    if (err.code) {
        if (jwtErrorCodes.indexOf(err.code) >= 0) {
            return res.status(err.status).send({
                meta: {
                    code: err.code,
                    success: false,
                    message: err.inner.message,
                }
            })
        }
    }
    console.error(err)
    return res.status(500).send({ 
        meta: { 
            //@ts-ignore
            error_id: res.sentry,
            code: 'internal_error',
            success: false,
        }
    })
}
