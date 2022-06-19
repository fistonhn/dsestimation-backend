import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class Materials extends Model {
    static associate(models) {
      // define association here
      Materials.belongsToMany(models.Estimations, {
        through: models.EstimationLibrary,
        foreignKey: "materialId",
        as: "estimations",
      });

      // suppliers
      Materials.belongsTo(models.Suppliers, {
        foreignKey: {
          name: "supplierId",
          allowNull: true,
        },
        as: "suppliers",
      });

      // users
      Materials.belongsTo(models.Users, {
        foreignKey: {
          name: "userId",
          allowNull: true,
        },
        as: "createdBy",
      });
    }
  }

  Materials.init(
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
      quantity: {
        type: DataTypes.INTEGER,
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      caveragePerUnit: {
        type: DataTypes.DECIMAL,
      },
      price: {
        type: DataTypes.DECIMAL,
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
      modelName: "Materials",
      tableName: "materials",
      timestamps: true,
    }
  );
  return Materials;
};
