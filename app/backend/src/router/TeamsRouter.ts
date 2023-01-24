import { Router, Request, Response } from 'express';
import TeamsController from '../controllers/TeamsController';

const teamsRouter = Router();

teamsRouter.get('/', (req: Request, res: Response) => TeamsController.getAll(req, res));
teamsRouter.get('/:id', (req: Request, res: Response) => TeamsController.getById(req, res));

export default teamsRouter;
