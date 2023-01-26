import IMatch from '../interfaces/IMatch';
import Match from '../database/models/Match';
import ILeaderboard from '../interfaces/ILeaderboard';
import IMatchData from '../interfaces/IMatchData';
import Team from '../database/models/Team';

class LeaderboardService {
  static async getAllMatches(): Promise<Match[]> {
    return Match.findAll(
      { where: { inProgress: false },
        include: [{
          model: Team,
          as: 'homeTeam',
          attributes: ['teamName'],
        }, {
          model: Team,
          as: 'awayTeam',
          attributes: ['teamName'],
        }],
      },
    );
  }

  static async get(): Promise<ILeaderboard[]> {
    const matches = await this.getAllMatches() as IMatch[];
    const startingLeaderboard = this.changeMatchesData(matches);
    return this.changedLeaderboard(startingLeaderboard);
  }

  static async getAllHome(): Promise<ILeaderboard[]> {
    const matches = await this.getAllMatches() as IMatch[];
    const startingLeaderboard = this.changeHomeMatchesData(matches);
    return this.changedLeaderboard(startingLeaderboard);
  }

  static async getAllAway(): Promise<ILeaderboard[]> {
    const matches = await this.getAllMatches() as IMatch[];
    const startingLeaderboard = this.changeAwayMatchesData(matches);
    return this.changedLeaderboard(startingLeaderboard);
  }

  private static changeMatchesData(insertMatch: IMatch[]): ILeaderboard[] {
    const table: ILeaderboard[] = [];
    insertMatch.forEach(({ homeTeamGoals, awayTeamGoals, homeTeam, awayTeam }) => {
      const homeTeamIdName = this.findTeamIndex(table, homeTeam.teamName);
      const homeTeamMatchData = this.getMatchData(homeTeamGoals, awayTeamGoals);
      const awayTeamIdName = this.findTeamIndex(table, awayTeam.teamName);
      const awayTeamMatchData = this.getMatchData(awayTeamGoals, homeTeamGoals);

      if (homeTeamIdName < 0) {
        table.push(this.newEntry(homeTeam.teamName, homeTeamMatchData));
      } else {
        table[homeTeamIdName] = this.updateEntry(table[homeTeamIdName], homeTeamMatchData);
      }
      if (awayTeamIdName < 0) {
        table.push(this.newEntry(awayTeam.teamName, awayTeamMatchData));
      } else {
        table[awayTeamIdName] = this.updateEntry(table[awayTeamIdName], awayTeamMatchData);
      }
    });
    return table;
  }

  private static changeHomeMatchesData(insertMatch: IMatch[]): ILeaderboard[] {
    const table: ILeaderboard[] = [];
    insertMatch.forEach(({ homeTeamGoals, awayTeamGoals, homeTeam }) => {
      const homeTeamIdName = this.findTeamIndex(table, homeTeam.teamName);
      const homeTeamMatchData = this.getMatchData(homeTeamGoals, awayTeamGoals);

      if (homeTeamIdName < 0) {
        table.push(this.newEntry(homeTeam.teamName, homeTeamMatchData));
      } else {
        table[homeTeamIdName] = this.updateEntry(table[homeTeamIdName], homeTeamMatchData);
      }
    });
    return table;
  }

  private static changeAwayMatchesData(insertMatch: IMatch[]): ILeaderboard[] {
    const table: ILeaderboard[] = [];
    insertMatch.forEach(({ homeTeamGoals, awayTeamGoals, awayTeam }) => {
      const awayTeamIdName = this.findTeamIndex(table, awayTeam.teamName);
      const awayTeamMatchData = this.getMatchData(awayTeamGoals, homeTeamGoals);

      if (awayTeamIdName < 0) {
        table.push(this.newEntry(awayTeam.teamName, awayTeamMatchData));
      } else {
        table[awayTeamIdName] = this.updateEntry(table[awayTeamIdName], awayTeamMatchData);
      }
    });
    return table;
  }

  private static changedLeaderboard(startingMatches: ILeaderboard[]): ILeaderboard[] {
    const matches = startingMatches;
    matches.sort((a: ILeaderboard, b: ILeaderboard) => (
      b.totalPoints - a.totalPoints
      || b.totalVictories - a.totalVictories
      || b.goalsBalance - a.goalsBalance
      || b.goalsFavor - a.goalsFavor
      || a.goalsOwn - b.goalsOwn
    ));

    return matches;
  }

  private static findTeamIndex(matches: ILeaderboard[], teamName: string): number {
    return matches.findIndex(({ name }) => name === teamName);
  }

  private static getMatchResult(teamGoals: number, otherTeamGoals: number) {
    const matchResult = {
      points: 1,
      victory: 0,
      draw: 1,
      loss: 0,
    };
    if (teamGoals > otherTeamGoals) {
      matchResult.points = 3;
      matchResult.victory = 1;
      matchResult.draw = 0;
    }
    if (otherTeamGoals > teamGoals) {
      matchResult.points = 0;
      matchResult.loss = 1;
      matchResult.draw = 0;
    }
    return matchResult;
  }

  private static getMatchData(teamGoals: number, otherTeamGoals: number): IMatchData<number> {
    const matchResult = this.getMatchResult(teamGoals, otherTeamGoals);
    const matchData = {
      points: matchResult.points,
      victory: matchResult.victory,
      draw: matchResult.draw,
      loss: matchResult.loss,
      goalsFavor: teamGoals,
      goalsOwn: otherTeamGoals,
      goalsBalance: teamGoals - otherTeamGoals,
    };
    return matchData;
  }

  private static newEntry(
    teamName: string,
    teamMatchData: IMatchData<number>,
  ): ILeaderboard {
    return {
      name: teamName,
      totalPoints: teamMatchData.points,
      totalGames: 1,
      totalVictories: teamMatchData.victory,
      totalDraws: teamMatchData.draw,
      totalLosses: teamMatchData.loss,
      goalsFavor: teamMatchData.goalsFavor,
      goalsOwn: teamMatchData.goalsOwn,
      goalsBalance: teamMatchData.goalsBalance,
      efficiency: ((teamMatchData.points / (1 * 3)) * 100).toFixed(2),
    };
  }

  private static updateEntry(
    teamEntry: ILeaderboard,
    teamMatchData: IMatchData<number>,
  ): ILeaderboard {
    const sumMatches = teamEntry.totalGames + 1;
    const sumPoints = teamEntry.totalPoints + teamMatchData.points;
    return {
      name: teamEntry.name,
      totalPoints: sumPoints,
      totalGames: sumMatches,
      totalVictories: teamEntry.totalVictories + teamMatchData.victory,
      totalDraws: teamEntry.totalDraws + teamMatchData.draw,
      totalLosses: teamEntry.totalLosses + teamMatchData.loss,
      goalsFavor: teamEntry.goalsFavor + teamMatchData.goalsFavor,
      goalsOwn: teamEntry.goalsOwn + teamMatchData.goalsOwn,
      goalsBalance: teamEntry.goalsBalance + teamMatchData.goalsBalance,
      efficiency: ((sumPoints / (sumMatches * 3)) * 100).toFixed(2),
    };
  }
}

export default LeaderboardService;
