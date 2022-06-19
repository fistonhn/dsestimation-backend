import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class SubContractors extends Model {
    static associate(models) {
      // associate here

      // users
      SubContractors.belongsTo(models.Users, {
        foreignKey: {
          name: "userId",
          allowNull: true,
        },
        as: "createdBy",
      });

      // estimations
      SubContractors.belongsToMany(models.Estimations, {
        through: models.EstimationLibrary,
        foreignKey: "subContractorId",
        as: "estimations",
      });
    }
  }
  SubContractors.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
      },
      unit: {
        type: DataTypes.STRING,
      },
      quantity: {
        type: DataTypes.DECIMAL,
      },
      price: {
        type: DataTypes.DECIMAL(100, 2),
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
      modelName: "SubContractors",
      tableName: "sub_contractors",
      timestamps: true,
    }
  );
  return SubContractors;
};
