module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("materials", {
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
      quantity: {
        type: Sequelize.INTEGER,
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      caveragePerUnit: {
        type: Sequelize.DECIMAL,
      },
      price: {
        type: Sequelize.DECIMAL(100, 2),
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
    await queryInterface.dropTable("materials");
  },
};
