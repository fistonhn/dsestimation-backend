import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class UserMaterials extends Model {
    static associate(models) {
      // define association here

      UserMaterials.belongsToMany(models.UserEstimations, {
        through: models.UserEstimationLibrary,
        foreignKey: "materialId",
        as: "estimations",
      });

      UserMaterials.hasOne(models.UserEstimationLibrary, {
        foreignKey: "materialId",
        as: "material_calculation",
      });

      // users
      UserMaterials.belongsTo(models.Users, {
        foreignKey: {
          name: "userId",
          allowNull: false,
        },
        as: "createdBy",
      });

      // suppliers
      UserMaterials.belongsTo(models.UserSupplier, {
        foreignKey: {
          name: "supplierId",
          allowNull: true,
        },
        as: "suppliers",
      });

      // projects
      UserMaterials.belongsTo(models.Projects, {
        foreignKey: {
          name: "projectId",
          allowNull: true,
        },
        as: "materials_project",
      });

      // consumption
      UserMaterials.hasMany(models.UserMaterialConsumption, {
        foreignKey: {
          name: "materialId",
          allowNull: false,
        },
        as: "consumed_material",
      });
    }
  }

  UserMaterials.init(
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
      caveragePerUnit: {
        type: DataTypes.DECIMAL,
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(100, 2),
      },
      supplierId: {
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
      projectId: {
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
      modelName: "UserMaterials",
      tableName: "user_materials",
      timestamps: true,
    }
  );
  return UserMaterials;
};
