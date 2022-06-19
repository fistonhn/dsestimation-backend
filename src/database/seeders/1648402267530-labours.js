module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("labours", [
      {
        name: "Carpenter",
        unit: "Days",
        wages: 6000,
        number: 1
      },
      {
        name: "Masons",
        unit: "Days",
        wages: 6000,
        number: 1
      },
      {
        name: "Mixer Operator",
        unit: "Days",
        wages: 6000,
        number: 1
      },
      {
        name: "Operator",
        unit: "Days",
        wages: 6666.666666666667,
        number: 1
      },
      {
        name: "Porters",
        unit: "Days",
        wages: 3000,
        number: 1
      },
      {
        name: "Skilled Labour",
        unit: "Days",
        wages: 10000,
        number: 1
      },
      {
        name: "Supervisor",
        unit: "Days",
        wages: 6000,
        number: 1
      },
      {
        name: "Jointer",
        unit: "Days",
        wages: 3500,
        number: 1
      },
      {
        name: "Steel fixer",
        unit: "Days",
        wages: 10000,
        number: 1
      },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("labours", null, {});
  },
};
