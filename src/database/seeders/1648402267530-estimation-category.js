module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("estimation_categories", [
      {
        name: "PREPARATORY WORKS",
      },
      {
        name: "EARTHWORKS",
      },
      {
        name: "SUB-BASE, BASE AND BITUMINOUS WORKS",
      },
      {
        name: "FINAL LAYER WORKS",
      },
      {
        name: "DRAINAGE WORKS AND UTILITY DUCT",
      },
      {
        name: "SAFETY AND SIGNALLING",
      },
      {
        name: "STREET LIGHTING ",
      },
      {
        name: "ENVIRONMENTAL MITIGATION AND LANDSCAPING",
      },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("estimation_categories", null, {});
  },
};
