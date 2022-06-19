import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class Equipments extends Model {
    static associate(models) {
      // define association here

      // estimations
      Equipments.belongsToMany(models.Estimations, {
        through: models.EstimationLibrary,
        foreignKey: "equipmentId",
        as: "estimations",
      });

      // suppliers
      Equipments.belongsTo(models.Suppliers, {
        foreignKey: {
          name: "supplierId",
          allowNull: true,
        },
        as: "suppliers",
      });

      // users
      Equipments.belongsTo(models.Users, {
        foreignKey: {
          name: "userId",
          allowNull: true,
        },
        as: "createdBy",
      });
    }
  }

  Equipments.init(
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
      caveragePerUnit: {
        type: DataTypes.DECIMAL,
      },
      hireRatePrice: {
        type: DataTypes.INTEGER,
      },
      number: {
        type: DataTypes.INTEGER,
      },
      supplierId: {
        type: DataTypes.INTEGER,
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
      modelName: "Equipments",
      tableName: "equipments",
      timestamps: true,
    }
  );
  return Equipments;
};
