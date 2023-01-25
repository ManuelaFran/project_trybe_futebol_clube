import { Router, Request, Response, NextFunction } from 'express';
import ValidateMatchSave from '../middlewares/ValidateMatchSave';
import MatchesController from '../controllers/MatchesController';
import Token from '../middlewares/Token';

const matchesRouter = Router();

matchesRouter.get('/', (req: Request, res: Response) => MatchesController.getAll(req, res));
matchesRouter.post(
  '/',
  (req: Request, res: Response, next: NextFunction) => ValidateMatchSave.validate(req, res, next),
  (req: Request, res: Response, next: NextFunction) => Token.verify(req, res, next),
  (req: Request, res: Response) => MatchesController.add(req, res),
);
matchesRouter.patch(
  '/:id/finish',
  (req: Request, res: Response) => MatchesController.finish(req, res),
);
matchesRouter.patch(
  '/:id',
  (req: Request, res: Response) => MatchesController.updateMatches(req, res),
);

export default matchesRouter;
