import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class Projects extends Model {
    static associate(models) {
      // projects -> user
      Projects.belongsTo(models.Users, {
        foreignKey: {
          name: "userId",
          allowNull: false,
        },
        as: "createdBy",
      });
      Projects.belongsTo(models.Staffs, {
        foreignKey: {
          name: "adminId",
          allowNull: true,
        },
        as: "created_by_staff",
      });

      Projects.hasMany(models.UserEstimationCategory, {
        foreignKey: {
          name: "projectId",
          allowNull: true,
        },
        as: "workSpecification",
      });

      Projects.hasOne(models.UserEstimationLibrary, {
        foreignKey: {
          name: "projectId",
          allowNull: false,
        },
        as: "estimation",
      });

      // projects -> supplier
      Projects.hasMany(models.UserSupplier, {
        foreignKey: {
          name: "projectId",
          allowNull: true,
        },
        as: "suppliers",
      });

      // UserEstimations
      Projects.hasMany(models.UserEstimations, {
        foreignKey: {
          name: "projectId",
          allowNull: false,
        },
        as: "estimations",
      });

      // UserLabours
      Projects.hasMany(models.UserLabours, {
        foreignKey: {
          name: "projectId",
          allowNull: true,
        },
        as: "project_labours",
      });
      // UserSubContractors
      Projects.hasMany(models.UserSubContractors, {
        foreignKey: {
          name: "projectId",
          allowNull: true,
        },
        as: "project_subcontractors",
      });

      // UserEquipments
      Projects.hasMany(models.UserEquipments, {
        foreignKey: {
          name: "projectId",
          allowNull: true,
        },
        as: "project_equipments",
      });

      // UserMaterials
      Projects.hasMany(models.UserMaterials, {
        foreignKey: {
          name: "projectId",
          allowNull: true,
        },
        as: "project_materials",
      });
    }
  }

  Projects.init(
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
      description: {
        type: DataTypes.STRING,
      },
      client: {
        type: DataTypes.STRING,
      },
      contractor: {
        type: DataTypes.STRING,
      },
      consultant: {
        type: DataTypes.STRING,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM,
        values: [
          "not started",
          "on progress",
          "suspended",
          "canceled",
          "completed",
        ],
        defaultValue: "not started",
      },
      outputAndPrice: {
        type: DataTypes.ENUM,
        values: ["daily", "hourly"],
      },
      isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      adminId: {
        type: DataTypes.INTEGER,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Projects",
      tableName: "projects",
      timestamps: false,
    }
  );
  return Projects;
};
