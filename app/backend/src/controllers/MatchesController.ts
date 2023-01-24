import { Request, Response } from 'express';
import MatchesService from '../services/MatchesService';

class MatchesController {
  static async getAll(_req: Request, res: Response) {
    const matches = await MatchesService.getAll();
    return res.status(200).json(matches);
  }
}

export default MatchesController;
