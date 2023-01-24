import Team from '../database/models/Team';
import Match from '../database/models/Match';
import IMatch from '../interfaces/IMatch';

class MatchesService {
  static async getAll(query: string): Promise<IMatch[]> {
    const matches = await Match.findAll({
      include: [{
        model: Team,
        as: 'homeTeam',
        attributes: ['teamName'],
      }, {
        model: Team,
        as: 'awayTeam',
        attributes: ['teamName'],
      }],
    });
    if (query === 'false') {
      return matches.filter(({ inProgress }) => !inProgress) as IMatch[];
    }
    if (query === 'true') {
      return matches.filter(({ inProgress }) => inProgress) as IMatch[];
    }
    return matches as IMatch[];
  }
}

export default MatchesService;
