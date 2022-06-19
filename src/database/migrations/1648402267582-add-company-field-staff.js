module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add column company to table staffs
    await queryInterface.addColumn("staffs", "company", {
      type: Sequelize.STRING,
    });
  },
  down: async (queryInterface, Sequelize) => {
    // Remove column company from table staffs
    await queryInterface.removeColumn("staffs", "company");
  },
};
