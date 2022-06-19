import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class UserSupplier extends Model {
    static associate(models) {
      // associations can be defined here

      // user equipment
      UserSupplier.hasMany(models.UserEquipments, {
        foreignKey: {
          name: "supplierId",
          allowNull: true,
        },
        as: "supplied_equipments",
      });

      // user materials
      UserSupplier.hasMany(models.UserMaterials, {
        foreignKey: {
          name: "supplierId",
          allowNull: true,
        },
        as: "supplied_materials",
      });

      UserSupplier.belongsTo(models.Projects, {
        foreignKey: {
          name: "projectId",
          allowNull: true,
        },
        as: "projects",
      });

      UserSupplier.belongsTo(models.Users, {
        foreignKey: {
          name: "userId",
          allowNull: true,
        },
        as: "client",
      });
    }
  }

  UserSupplier.init(
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
      projectId: {
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
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
      modelName: "UserSupplier",
      tableName: "user_suppliers",
      timestamps: true,
    }
  );

  return UserSupplier;
};
