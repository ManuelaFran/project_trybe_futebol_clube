import { Request, Response, NextFunction } from 'express';
import ErrorMap from '../utils/errorMap';

class ValidateMatchSave {
  static validate(req: Request, res: Response, next: NextFunction) {
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = req.body;
    const fields = [homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals];

    if (fields.some((field) => field === undefined)) {
      return res.status(ErrorMap.BAD_REQUEST).json({ message: 'All fields must be provided' });
    }

    if (fields.some((field) => typeof field !== 'number')) {
      return res.status(ErrorMap.BAD_REQUEST).json({
        message: 'All fields must be of type number',
      });
    }

    if (homeTeamId === awayTeamId) {
      return res.status(ErrorMap.INVALID).json({
        message: 'It is not possible to create a match with two equal teams',
      });
    }

    next();
  }
}

export default ValidateMatchSave;
