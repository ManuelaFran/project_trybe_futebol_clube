import Team from '../database/models/Team';
import Match from '../database/models/Match';
import IMatch from '../interfaces/IMatch';
import IMatchSave from '../interfaces/IMatchSave';
import ErrorMap from '../utils/errorMap';

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

  private static async verifyTeams(teams: number[]): Promise<boolean> {
    const promises = teams.map(async (teamId) => Team.findByPk(teamId));
    const results = await Promise.all(promises);
    return results.every((result) => result);
  }

  static async add(insertData: IMatchSave) {
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = insertData;
    const validatingTeam = await MatchesService.verifyTeams([homeTeamId, awayTeamId]);
    if (!validatingTeam) {
      return { type: ErrorMap.NOT_FOUND, message: 'There is no team with such id!' };
    }

    const match = await Match.create({
      homeTeamId,
      homeTeamGoals,
      awayTeamId,
      awayTeamGoals,
      inProgress: true,
    });

    return { type: null, message: match };
  }

  static async finish(id: string): Promise<void> {
    await Match.update({ inProgress: false }, { where: { id } });
  }
}

export default MatchesService;
