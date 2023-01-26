import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';

class LeaderboardController {
  static async get(_req: Request, res: Response) {
    const leaderboard = await LeaderboardService.get();
    return res.status(200).json(leaderboard);
  }

  static async getAllHome(_req: Request, res: Response) {
    const leaderboard = await LeaderboardService.getAllHome();
    return res.status(200).json(leaderboard);
  }

  static async getAllAway(_req: Request, res: Response) {
    const leaderboard = LeaderboardService.getAllAway();
    return res.status(200).json(leaderboard);
  }
}

export default LeaderboardController;
