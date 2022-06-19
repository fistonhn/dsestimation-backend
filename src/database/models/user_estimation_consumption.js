import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class UserEstimationsConsumption extends Model {
    static associate(models) {
      // define association here
      UserEstimationsConsumption.belongsTo(models.UserEstimations, {
        foreignKey: {
          name: "estimationId",
          allowNull: true,
        },
        as: "consumed_estimation",
      });

      // equipments consumption
      UserEstimationsConsumption.hasMany(models.UserEquipmentConsumption, {
        foreignKey: {
          name: "estimationId",
          allowNull: true,
        },
        as: "consumed_equipment",
      });

      // materials consumption
      UserEstimationsConsumption.hasMany(models.UserMaterialConsumption, {
        foreignKey: {
          name: "estimationId",
          allowNull: true,
        },
        as: "consumed_material",
      });

      // labor consumption
      UserEstimationsConsumption.hasMany(models.UserLabourConsumption, {
        foreignKey: {
          name: "estimationId",
          allowNull: true,
        },
        as: "consumed_labour",
      });

      // subcontractor consumption
      UserEstimationsConsumption.hasMany(models.UserSubcontractorConsumption, {
        foreignKey: {
          name: "estimationId",
          allowNull: true,
        },
        as: "consumed_subcontractor",
      });
    }
  }

  UserEstimationsConsumption.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      executedQuantity: {
        type: DataTypes.DECIMAL,
      },
      remainingQuantity: {
        type: DataTypes.DECIMAL,
      },
      percentage: {
        type: DataTypes.DECIMAL,
      },
      executedDate: {
        type: DataTypes.DATE,
      },
      estimationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalEquipmentConsumed: {
        type: DataTypes.DECIMAL,
      },
      totalLabourConsumed: {
        type: DataTypes.DECIMAL,
      },
      totalMaterialConsumed: {
        type: DataTypes.DECIMAL,
      },
      totalSubcontractorConsumed: {
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
      modelName: "UserEstimationsConsumption",
      tableName: "user_estimations_consumption",
      timestamps: true,
    }
  );
  return UserEstimationsConsumption;
};
