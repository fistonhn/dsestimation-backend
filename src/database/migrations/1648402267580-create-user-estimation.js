module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("user_estimations", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        required: true,
      },
      estimationUnit: {
        type: Sequelize.STRING,
        required: true,
      },
      estimationQuantity: {
        type: Sequelize.DECIMAL(100, 2),
        required: true,
      },
      workingHours: {
        type: Sequelize.INTEGER,
      },
      wastagePercentage: {
        type: Sequelize.DECIMAL(100, 2),
      },
      wastageTotal: {
        type: Sequelize.DECIMAL(100, 2),
      },
      transportPercentage: {
        type: Sequelize.DECIMAL(100, 2),
      },
      transportTotal: {
        type: Sequelize.DECIMAL(100, 2),
      },
      profitPercentage: {
        type: Sequelize.DECIMAL(100, 2),
      },
      profitTotal: {
        type: Sequelize.DECIMAL(100, 2),
      },
      overHeadPercentage: {
        type: Sequelize.DECIMAL(100, 2),
      },
      overHeadTotal: {
        type: Sequelize.DECIMAL(100, 2),
      },
      contigencyPercentage: {
        type: Sequelize.DECIMAL(100, 2),
      },
      contigencyTotal: {
        type: Sequelize.DECIMAL(100, 2),
      },
      subtotal: {
        type: Sequelize.DECIMAL(100, 2),
      },
      estimationRate: {
        type: Sequelize.DECIMAL(100, 2),
      },
      estimationTotalAmount: {
        type: Sequelize.DECIMAL(100, 2),
      },
      equipmentCostPerWorkItem: {
        type: Sequelize.DECIMAL(100, 2),
      },
      equipmentRatePerUnit: {
        type: Sequelize.DECIMAL(100, 2),
      },
      materialCostPerWorkItem: {
        type: Sequelize.DECIMAL(100, 2),
      },
      materialRatePerUnit: {
        type: Sequelize.DECIMAL(100, 2),
      },
      indirectCostPerWorkItem: {
        type: Sequelize.DECIMAL(100, 2),
      },
      indirectRatePerUnit: {
        type: Sequelize.DECIMAL(100, 2),
      },
      labourCostperWorkItem: {
        type: Sequelize.DECIMAL(100, 2),
      },
      labourRatePerUnit: {
        type: Sequelize.DECIMAL(100, 2),
      },
      subcontractorCostPerWorkItem: {
        type: Sequelize.DECIMAL(100, 2),
      },
      userEstimationCategoryId: {
        type: Sequelize.INTEGER,
      },
      projectId: {
        type: Sequelize.INTEGER,
      },
      userId: {
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
    await queryInterface.dropTable("user_estimations");
  },
};
