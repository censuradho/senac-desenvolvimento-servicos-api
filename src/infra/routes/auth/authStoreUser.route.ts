import { Router } from "express";

import { AuthStoreUserRepository } from "@/domain/repositories/auth/storeuser/AuthStoreUser.repository";
import { StoreUserRepository } from "@/domain/repositories/storeUser/User.repository";

import { prisma } from "@/services/PrismaClient";

import { 
  authStoreUserSignUpWithEmailAndPasswordValidation, 
  isValidEmailValidation, 
  signInWithEmailAndPasswordRequestBodyValidation 
} from "@/infra/middleware/auth/authStoreUser.validation";
import { AuthStoreUserController } from "@/infra/controllers/auth/authStoreUser.controller";
import { storeUserJwtMiddleware } from "@/infra/middleware/auth/storeUserJWT.middleware";
import { StoreRepository } from "@/domain/repositories/store/store.repository";
import { FileUploadService } from "@/services/FileUpload.service";

const authStoreUserRoute = Router()

const fileUploadService = new FileUploadService()
const storeRepository = new StoreRepository(prisma, fileUploadService)
const storeUserRepository = new StoreUserRepository(prisma)
const repository = new AuthStoreUserRepository(storeUserRepository, storeRepository)
const controller = new AuthStoreUserController(repository)

authStoreUserRoute.post(
  '/store-user/register',
  authStoreUserSignUpWithEmailAndPasswordValidation, 
  controller.signUpWithEmailAndPassword.bind(controller)
)

authStoreUserRoute.post(
  '/store-user/email-validation', 
  isValidEmailValidation, 
  controller.isValidEmail.bind(controller)
)

authStoreUserRoute.post(
  '/store-user/login', 
  signInWithEmailAndPasswordRequestBodyValidation,
  controller.signInWithEmailAndPassword.bind(controller)
)

authStoreUserRoute.get(
  '/store-user/me', 
  storeUserJwtMiddleware,
  controller.me.bind(controller)
)


authStoreUserRoute.get(
  '/store-user/logout', 
  controller.logout.bind(controller)
)

export {
  authStoreUserRoute
}