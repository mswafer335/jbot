import express from 'express'
import { getClientIp } from '@supercharge/request-ip';
export async function loggerMiddleware(req: express.Request, response: express.Response, next: express.NextFunction) {

	try {
		const ip = getClientIp(req)
		//	console.log("kek")
		//	console.log({ req })
		// console.log({ agent: req.useragent })
		const origIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		//	console.log(ip);
		const url = req.url
		const method = req.method
		const browser = req.useragent?.browser
		const version = req.useragent?.version
		const os = req.useragent?.os
		const platform = req.useragent?.platform

		const source = req.useragent?.source
		//console.log(`${method} ${url} ${ip} ${browser} ${version} ${os} ${platform} ${source}`)
		//flog.print("api", `${method} ${url} ${ip} ${origIp} ${browser} ${version} ${os} ${platform} ${source}`)
		console.log(`${method} ${url} ${ip} ${origIp} ${browser} ${version} ${os} ${platform} ${source}`)
	} catch (error) {
		console.log(error)
	}
	next();


}
