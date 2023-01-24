import Team from '../database/models/Team';

class TeamsService {
  static async getAll(): Promise<Team[]> {
    const teams = await Team.findAll();
    return teams;
  }

  static async getById(id: string): Promise<Team | null> {
    const team = await Team.findByPk(id);
    return team;
  }
}

export default TeamsService;
