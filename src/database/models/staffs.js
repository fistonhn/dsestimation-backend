import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class Staffs extends Model {
    static associate(models) {
      // define association here
      Staffs.belongsTo(models.Users, {
        foreignKey: {
          name: "managerId",
          allowNull: false,
        },
        as: "staff",
      });

      // user projects
      Staffs.hasMany(models.Projects, {
        foreignKey: {
          name: "adminId",
          allowNull: true,
        },
        as: "projects_i_created",
      });
    }
  }

  Staffs.init(
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
        defaultValue: "admin",
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
      managerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      modelName: "Staffs",
      tableName: "staffs",
      timestamps: true,
    }
  );

  return Staffs;
};
