import { Request, Response } from "express"

export default {
    dummy(req: Request, res: Response) {
        res.status(200).json({
            message: 'Success HIT Endpoint /dummy',
            data: "OK"
        })
    }
}