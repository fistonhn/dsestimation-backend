import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      // define association here

      // units
      Users.hasMany(models.Units, {
        foreignKey: {
          name: "userId",
          allowNull: true,
        },
        as: "units",
      });

      // equipments
      Users.hasMany(models.Equipments, {
        foreignKey: {
          name: "userId",
          allowNull: true,
        },
        as: "equipments",
      });

      // materials
      Users.hasMany(models.Materials, {
        foreignKey: {
          name: "userId",
          allowNull: true,
        },
        as: "materials",
      });

      // labours
      Users.hasMany(models.Labours, {
        foreignKey: {
          name: "userId",
          allowNull: true,
        },
        as: "labours",
      });

      // subcontractors
      Users.hasMany(models.SubContractors, {
        foreignKey: {
          name: "userId",
          allowNull: true,
        },
        as: "subcontractors",
      });

      Users.hasMany(models.Staffs, {
        foreignKey: {
          name: "managerId",
          allowNull: false,
        },
        as: "staff",
      });

      // user projects
      Users.hasMany(models.Projects, {
        foreignKey: {
          name: "userId",
          allowNull: false,
        },
        as: "projects",
      });
      // UserEquipments
      Users.hasMany(models.UserEquipments, {
        foreignKey: {
          name: "userId",
          allowNull: false,
        },
        as: "user-equipments",
      });

      // UserEstimations
      Users.hasMany(models.UserEstimations, {
        foreignKey: {
          name: "userId",
          allowNull: false,
        },
        as: "user-estimations",
      });

      Users.hasMany(models.Estimations, {
        foreignKey: {
          name: "userId",
          allowNull: true,
        },
        as: "estimations",
      });

      // UserMaterials
      Users.hasMany(models.UserMaterials, {
        foreignKey: {
          name: "userId",
          allowNull: false,
        },
        as: "user-materials",
      });

      // UserUnits
      Users.hasMany(models.UserUnits, {
        foreignKey: {
          name: "userId",
          allowNull: false,
        },
        as: "user-units",
      });

      // UserLabours
      Users.hasMany(models.UserLabours, {
        foreignKey: {
          name: "userId",
          allowNull: false,
        },
        as: "created-labours",
      });

      // UserSubContractors
      Users.hasMany(models.UserSubContractors, {
        foreignKey: {
          name: "userId",
          allowNull: false,
        },
        as: "user-subContractors",
      });

      // UserSuppliers
      Users.hasMany(models.UserSupplier, {
        foreignKey: {
          name: "userId",
          allowNull: true,
        },
        as: "our-suppliers",
      });
      //  our-suppliers
      Users.hasMany(models.Suppliers, {
        foreignKey: {
          name: "userId",
          allowNull: true,
        },
        as: "client-suppliers",
      });

      // estimationcategory
      Users.hasMany(models.EstimationCategory, {
        foreignKey: {
          name: "userId",
          allowNull: true,
        },
        as: "estimation-categories",
      });

      // UserEstimationCategory.
      Users.hasMany(models.UserEstimationCategory, {
        foreignKey: {
          name: "userId",
          allowNull: true,
        },
        as: "user-estimation-categories",
      });
    }
  }

  Users.init(
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      company: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["owner", "manager", "admin"],
        defaultValue: "manager",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      isConfirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
      modelName: "Users",
      tableName: "users",
      timestamps: true,
    }
  );

  return Users;
};
