import { Request, Response, NextFunction } from 'express';
import ErrorMap from '../utils/errorMap';

class ValidateMatchSave {
  static validate(req: Request, res: Response, next: NextFunction) {
    const { homeTeamId, awayTeamId } = req.body;

    if (homeTeamId === awayTeamId) {
      return res.status(ErrorMap.INVALID).json({
        message: 'It is not possible to create a match with two equal teams',
      });
    }

    next();
  }
}

export default ValidateMatchSave;
