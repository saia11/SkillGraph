import { Router } from 'express';
import { Joi, celebrate } from 'celebrate';
import { UserController } from '@/controllers';
import { authenticate } from '@/middleware/auth';
import { Container } from 'typedi';

const createUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    bio: Joi.string().optional(),
    avatarUrl: Joi.string().optional(),
    role: Joi.string().optional().default('member'),
});

const updateUserSchema = Joi.object({
    name: Joi.string().optional(),
    bio: Joi.string().optional(),
    avatarUrl: Joi.string().optional(),
});

const router = Router();

export default (app: Router): void => {
    app.use('/user', router);

    const userController = Container.get(UserController);

    router.post('/', celebrate({ body: createUserSchema }), authenticate, userController.createUser);
    router.get('/:id', authenticate, userController.getUser);
    router.delete('/:id', authenticate, userController.deleteUser);
    router.put('/:id', celebrate({ body: updateUserSchema }), authenticate, userController.updateUser);
};