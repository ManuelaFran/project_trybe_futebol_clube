import { Model,
  InferAttributes,
  InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import db from '.';
import Team from './Team';

class Match extends Model<InferAttributes<Match>, InferCreationAttributes<Match>> {
  declare id: CreationOptional<number>;
  declare homeTeamId: number;
  declare homeTeamGoals: number;
  declare awayTeamId: number;
  declare awayTeamGoals: number;
  declare inProgress: boolean;
}

Match.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  homeTeamId: {
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
  awayTeamId: {
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

Match.belongsTo(Team, { foreignKey: 'homeTeamId', as: 'homeTeam' });
Match.belongsTo(Team, { foreignKey: 'awayTeamId', as: 'awayTeam' });

export default Match;
