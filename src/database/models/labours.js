import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class Labours extends Model {
    static associate(models) {
      // associate here

      // users
      Labours.belongsTo(models.Users, {
        foreignKey: {
          name: "userId",
          allowNull: true,
        },
        as: "createdBy",
      });

      // estimations
      Labours.belongsToMany(models.Estimations, {
        through: models.EstimationLibrary,
        foreignKey: "labourId",
        as: "estimations",
      });
    }
  }

  Labours.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      number: {
        type: DataTypes.INTEGER,
      },
      unit: {
        type: DataTypes.STRING,
      },
      wages: {
        type: DataTypes.INTEGER,
      },
      caveragePerUnit: {
        type: DataTypes.DECIMAL,
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
      modelName: "Labours",
      tableName: "labours",
      timestamps: true,
    }
  );
  return Labours;
};
