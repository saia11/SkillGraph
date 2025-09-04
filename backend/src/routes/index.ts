import userRoutes from './user-route';
import { Router } from 'express';

export default (): Router => {
    const app = Router();
    userRoutes(app);
    return app;
};