import { Router } from 'express';

import { StoreController } from '@/infra/controllers/store.controller';
import { storeUserJwtMiddleware } from '@/infra/middleware/auth/storeUserJWT.middleware';

import { StoreRepository } from '@/domain/repositories/store/store.repository';

import { prisma } from '@/services/PrismaClient';
import { createStoreValidation } from '@/infra/middleware/store.middleware';

const storeRoutes = Router()

const repository = new StoreRepository(prisma)
const controller = new StoreController(repository)

storeRoutes.post(
  '/store', 
  storeUserJwtMiddleware,
  createStoreValidation,
  controller.create.bind(controller)
)

storeRoutes.get(
  '/store', 
  storeUserJwtMiddleware,
  controller.findByOwnerId.bind(controller)
)

export {
  storeRoutes
}