import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class UserSubcontractorConsumption extends Model {
    static associate(models) {
      // define association here
      UserSubcontractorConsumption.belongsTo(models.UserSubContractors, {
        foreignKey: {
          name: "subContractorId",
          allowNull: true,
        },
        as: "consumed_subcontractor",
      });
      // userestimation
      UserSubcontractorConsumption.belongsTo(
        models.UserEstimationsConsumption,
        {
          foreignKey: {
            name: "estimationId",
            allowNull: true,
          },
          as: "consumed_subcontractor_estimation",
        }
      );
    }
  }

  UserSubcontractorConsumption.init(
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
      subContractorId: {
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
      modelName: "UserSubcontractorConsumption",
      tableName: "subcontractor_consumption",
      timestamps: true,
    }
  );

  return UserSubcontractorConsumption;
};
