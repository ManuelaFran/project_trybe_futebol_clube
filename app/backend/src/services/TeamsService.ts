import Team from '../database/models/Team';

class TeamsService {
  static async getAll() {
    const teams = await Team.findAll();
    return teams;
  }
}

export default TeamsService;
