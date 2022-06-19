module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("projects", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      client: {
        type: Sequelize.STRING,
      },
      contractor: {
        type: Sequelize.STRING,
      },
      consultant: {
        type: Sequelize.STRING,
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM,
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
        type: Sequelize.ENUM,
        values: ["daily", "hourly"],
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("projects");
  },
};
