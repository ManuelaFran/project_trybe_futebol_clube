import { Router, Request, Response } from 'express';
import LeaderboardController from '../controllers/LeaderboardController';

const leaderboardRouter = Router();

leaderboardRouter.get('/', (req: Request, res: Response) => LeaderboardController.get(req, res));
leaderboardRouter.get(
  '/home',
  (req: Request, res: Response) => LeaderboardController.getAllHome(req, res),
);
leaderboardRouter.get(
  '/away',
  (req: Request, res: Response) => LeaderboardController.getAllAway(req, res),
);

export default leaderboardRouter;
