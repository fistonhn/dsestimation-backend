import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class UserEquipmentConsumption extends Model {
    static associate(models) {
      // define association here
      UserEquipmentConsumption.belongsTo(models.UserEquipments, {
        foreignKey: {
          name: "equipmentId",
          allowNull: true,
        },
        as: "consumed_equipment",
      });
      // userestimation
      UserEquipmentConsumption.belongsTo(models.UserEstimationsConsumption, {
        foreignKey: {
          name: "estimationId",
          allowNull: true,
        },
        as: "consumed_equipment_estimation",
      });
    }
  }

  UserEquipmentConsumption.init(
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
      estimationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      equipmentId: {
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
      modelName: "UserEquipmentConsumption",
      tableName: "equipment_consumption",
      timestamps: true,
    }
  );

  return UserEquipmentConsumption;
};
