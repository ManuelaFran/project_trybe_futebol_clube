import { Request, Response } from 'express';
import MatchesService from '../services/MatchesService';

class MatchesController {
  static async getAll(req: Request, res: Response) {
    const { inProgress = 'all' } = req.query;
    const matches = await MatchesService.getAll(inProgress as string);
    return res.status(200).json(matches);
  }
}

export default MatchesController;
