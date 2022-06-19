module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("equipments", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      unit: {
        type: Sequelize.STRING,
      },
      caveragePerUnit: {
        type: Sequelize.DECIMAL,
      },
      hireRatePrice: {
        type: Sequelize.INTEGER,
      },
      number: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      supplierId: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("equipments");
  },
};
