module.exports = {
  up: async (queryInterface, Sequelize) => {
    // add column adminId to table projects
    await queryInterface.addColumn("projects", "adminId", {
      type: Sequelize.INTEGER,
    });
  },
  down: async (queryInterface, Sequelize) => {
    // remove column adminId from table users
    await queryInterface.removeColumn("projects", "adminId");
  },
};
