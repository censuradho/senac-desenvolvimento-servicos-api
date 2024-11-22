import { CreateStoreUserDTO } from "@/domain/dto/StoreUser.dto";
import { HttpException } from "@/domain/models/HttpException";
import { ERRORS } from "@/shared/errors";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import { randomUUID } from "crypto";
import { IStoreUSerRepository } from "./IStoreUser.repository";

export class StoreUserRepository implements IStoreUSerRepository {
  constructor (private prisma: PrismaClient) {}

  async findByEmail (email: string) {
    return this.prisma.storeUser.findFirst({
      where: {
        email
      }
    })
  }

  async create (payload: CreateStoreUserDTO) {
    const alreadyHaveAccount = await this.findByEmail(payload.email)
   
    if (alreadyHaveAccount) throw new HttpException(400, ERRORS.STORE_USER.EMAIL_ALREADY_REGISTER)

    const { password, ...otherPayload } = payload

    const hashPassword = bcrypt.hashSync(password, 10)
    const id = randomUUID()


    return await this.prisma.storeUser.create({
      data: {
        id,
        ...otherPayload,
        password: hashPassword,
      }
    })

  }

  async findById (id: string) {
    return this.prisma.storeUser.findFirst({
      where: {
        id
      }
    })
  }
}