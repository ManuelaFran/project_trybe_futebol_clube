import { Model,
  InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import db from '.';

class Team extends Model<InferAttributes<Team>, InferCreationAttributes<Team>> {
  declare id: CreationOptional<number>;
  declare teamName: string;
}

Team.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  teamName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  underscored: true,
  modelName: 'Team',
  timestamps: false,
  sequelize: db,
});

export default Team;
