import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class Suppliers extends Model {
    static associate(models) {
      // associations can be defined here

      // material
      Suppliers.hasMany(models.Materials, {
        foreignKey: {
          name: "supplierId",
          allowNull: true,
        },
        as: "supplied_materials",
      });

      // equipment
      Suppliers.hasMany(models.Equipments, {
        foreignKey: {
          name: "supplierId",
          allowNull: true,
        },
        as: "supplied_equipments",
      });

      // users
      Suppliers.belongsTo(models.Users, {
        foreignKey: {
          name: "userId",
          allowNull: true,
        },
        as: "client-suppliers",
      });
    }
  }

  Suppliers.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
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
      modelName: "Suppliers",
      tableName: "suppliers",
      timestamps: true,
    }
  );

  return Suppliers;
};
