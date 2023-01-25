import { Request, Response } from 'express';
import IMatchSave from '../interfaces/IMatchSave';
import MatchesService from '../services/MatchesService';

class MatchesController {
  static async getAll(req: Request, res: Response) {
    const { inProgress = 'all' } = req.query;
    const matches = await MatchesService.getAll(inProgress as string);
    return res.status(200).json(matches);
  }

  static async add(req: Request, res: Response) {
    const matchSave = req.body as IMatchSave;
    const { type, message } = await MatchesService.add(matchSave);
    if (type) {
      return res.status(type).json({ message });
    }

    return res.status(201).json(message);
  }

  static async finish(req: Request, res: Response) {
    const { id } = req.params;
    await MatchesService.finish(id);
    return res.status(200).json({ message: 'Finished' });
  }

  static async updateMatches(req: Request, res: Response) {
    const { homeTeamGoals, awayTeamGoals } = req.body;
    const { id } = req.params;
    const match = await MatchesService.updateMatches(id, homeTeamGoals, awayTeamGoals);
    return res.status(200).json(match);
  }
}

export default MatchesController;
