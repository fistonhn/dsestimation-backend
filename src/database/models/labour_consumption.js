import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class UserLabourConsumption extends Model {
    static associate(models) {
      // define association here
      UserLabourConsumption.belongsTo(models.UserLabours, {
        foreignKey: {
          name: "labourId",
          allowNull: true,
        },
        as: "consumed_labour",
      });
      // userestimation
      UserLabourConsumption.belongsTo(models.UserEstimationsConsumption, {
        foreignKey: {
          name: "estimationId",
          allowNull: true,
        },
        as: "consumed_labour_estimation",
      });
    }
  }

  UserLabourConsumption.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      unit: {
        type: DataTypes.STRING,
      },
      consumedQuantity: {
        type: DataTypes.DECIMAL,
      },
      consumedPrice: {
        type: DataTypes.DECIMAL,
      },
      consumedDate: {
        type: DataTypes.DATE,
      },
      consumedTotal: {
        type: DataTypes.DECIMAL,
      },
      labourId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      estimationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      percentage: {
        type: DataTypes.DECIMAL,
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
      modelName: "UserLabourConsumption",
      tableName: "labour_consumption",
      timestamps: true,
    }
  );

  return UserLabourConsumption;
};
