import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class UserMaterialConsumption extends Model {
    static associate(models) {
      // define association here
      UserMaterialConsumption.belongsTo(models.UserMaterials, {
        foreignKey: {
          name: "materialId",
          allowNull: true,
        },
        as: "consumed_material",
      });
      // userestimation
      UserMaterialConsumption.belongsTo(models.UserEstimationsConsumption, {
        foreignKey: {
          name: "estimationId",
          allowNull: true,
        },
        as: "consumed_material_estimation",
      });
    }
  }

  UserMaterialConsumption.init(
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
      materialId: {
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
      modelName: "UserMaterialConsumption",
      tableName: "material_consumption",
      timestamps: true,
    }
  );

  return UserMaterialConsumption;
};
