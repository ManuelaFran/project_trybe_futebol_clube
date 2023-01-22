import { Model,
  InferAttributes,
  InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import db from '.';
import Team from './Team';

class Match extends Model<InferAttributes<Match>, InferCreationAttributes<Match>> {
  declare id: CreationOptional<number>;
  declare homeTeam: number;
  declare homeTeamGoals: number;
  declare awayTeam: number;
  declare awayTeamGoals: number;
  declare inProgress: boolean;
}

Match.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  homeTeam: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      key: 'id',
      model: 'Team',
    },
  },
  homeTeamGoals: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  awayTeam: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      key: 'id',
      model: 'Team',
    },
  },
  awayTeamGoals: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  inProgress: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'Match',
  tableName: 'matches',
  timestamps: false,
});

Team.hasMany(Match, { foreignKey: 'homeTeamId' });

Team.hasMany(Match, { foreignKey: 'awayTeamId' });

Match.belongsTo(Team, { foreignKey: 'homeTeamId', as: 'teamHome' });
Match.belongsTo(Team, { foreignKey: 'awayTeamId', as: 'teamAway' });

export default Match;
