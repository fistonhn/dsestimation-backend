module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("user_subcontractors", {
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
      quantity: {
        type: Sequelize.DECIMAL,
      },
      price: {
        type: Sequelize.DECIMAL(100, 2),
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      projectId: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("user_subcontractors");
  },
};
