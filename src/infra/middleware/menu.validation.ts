import { CreateMenuDTO, FindManyMenuQueryDTO } from "@/domain/dto/menu.dto"
import { plainToInstance } from "class-transformer"
import { validateOrReject } from "class-validator"
import { NextFunction, Request, Response } from "express"

export async function createMenuValidation (req: Request, res: Response, next: NextFunction) {
  if (!req.body) return res.status(400).json({
    message: 'MISSING_REQUEST_BODY'
  })

  try {
    const payload = req.body as CreateMenuDTO

    const validation = new CreateMenuDTO()
  
    validation.id = payload.id
    validation.label = payload.label
    validation.products = payload.products
    validation.visible = payload.visible

    await validateOrReject(validation)

    req.body = validation

    next()
  } catch (error: any) {
    return res.status(400).json({
      message: Object.values(error[0].constraints)[0]
    })
  }
}


export async function findManyPaginateQueryValidation (req: Request, res: Response, next: NextFunction) {
  if (!req.body) return res.status(400).json({
    message: 'MISSING_REQUEST_BODY'
  })

  try {

    const queryParams = plainToInstance(FindManyMenuQueryDTO, req.query);

    await validateOrReject(queryParams)

    next()
  } catch (error: any) {
    return res.status(400).json({
      message: Object.values(error[0].constraints)[0]
    })
  }
}