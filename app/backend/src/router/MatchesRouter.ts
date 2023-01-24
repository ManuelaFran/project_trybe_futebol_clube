import { Router, Request, Response } from 'express';
import MatchesController from '../controllers/MatchesController';

const matchesRouter = Router();

matchesRouter.get('/', (req: Request, res: Response) => MatchesController.getAll(req, res));

export default matchesRouter;
