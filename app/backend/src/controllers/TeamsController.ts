import { Request, Response } from 'express';
import TeamsService from '../services/TeamsService';

class TeamsController {
  static async getAll(_req: Request, res: Response) {
    const teams = await TeamsService.getAll();
    return res.status(200).json(teams);
  }
}

export default TeamsController;