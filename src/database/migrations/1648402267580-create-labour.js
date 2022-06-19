module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("labours", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      number: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      unit: {
        type: Sequelize.STRING,
      },
      wages: {
        type: Sequelize.INTEGER,
      },
      caveragePerUnit: {
        type: Sequelize.DECIMAL,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      isApproved: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("labours");
  },
};
