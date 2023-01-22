import { Router, Request, Response } from 'express';
import LoginController from '../controllers/LoginController';

const loginRouter = Router();

loginRouter.post('/', (req: Request, res: Response) => LoginController.login(req, res));

export default loginRouter;
