module.exports = {
  up: async (queryInterface, Sequelize) => {
    // add column company to table users
    await queryInterface.addColumn("users", "company", {
      type: Sequelize.STRING,
    });
  },
  down: async (queryInterface, Sequelize) => {
    // remove column company from table users
    await queryInterface.removeColumn("users", "company");
  },
};
