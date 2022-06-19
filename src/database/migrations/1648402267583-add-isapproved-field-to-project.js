module.exports = {
  up: async (queryInterface, Sequelize) => {
    // add column company to table users
    await queryInterface.addColumn("projects", "isApproved", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },
  down: async (queryInterface, Sequelize) => {
    // remove column company from table users
    await queryInterface.removeColumn("projects", "isApproved");
  },
};
