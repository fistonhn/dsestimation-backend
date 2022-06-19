import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class Units extends Model {
    static associate(models) {
      // define association here

      // users
      Units.belongsTo(models.Users, {
        foreignKey: {
          name: "userId",
          allowNull: true,
        },
        as: "createdBy",
      });
    }
  }

  Units.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      symbol: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      meaning: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
      isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Units",
      tableName: "units",
      timestamps: true,
    }
  );
  return Units;
};
