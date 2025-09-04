import { Request, Response } from 'express';
import { UserService } from '@/services';
import { Service, Container } from 'typedi';

@Service()
class UserController {
    
    constructor(private readonly userService: UserService) {
        this.userService = Container.get(UserService);
    }

    async createUser(req: Request, res: Response): Promise<void> {
       const user = await this.userService.createUser(req.body);
       res.json(user)
    }
    
    async getUser(req: Request, res: Response): Promise<void> {
        const user = await this.userService.findById(req.params.id);
        res.json(user)
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        await this.userService.deleteUser(req.params.id);
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        const user = await this.userService.updateUser(req.params.id, req.body);
        res.json(user);
    }

}

export default UserController;