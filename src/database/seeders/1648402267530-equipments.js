module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("equipments", [
      {
        name: "Asphalt Cutting Machine",
        unit: "Day",
        hireRatePrice: 35000,
        number: 1
      },
      {
        name: "Backhoe for culvert installation",
        unit: "Hr",
        hireRatePrice: 50000,
        number: 1
      },
      {
        name: "Bitumen Sprayer",
        unit: "Day",
        hireRatePrice: 400000,
        number: 1
      },
      {
        name: "Boiler",
        unit: "Day",
        hireRatePrice: 25000,
        number: 1
      },
      {
        name: "Bulldozer",
        unit: "Hr",
        hireRatePrice: 60000,
        number: 1
      },
      {
        name: "Compactor for subgrade",
        unit: "Day",
        hireRatePrice: 180000,
        number: 1
      },
      {
        name: "Compactor for subbase",
        unit: "Day",
        hireRatePrice: 180000,
        number: 1
      },
      {
        name: "Compactor for base",
        unit: "Day",
        hireRatePrice: 180000,
        number: 1
      },
      {
        name: "Concrete Mixer",
        unit: "Day",
        hireRatePrice: 50000,
        number: 1
      },
      {
        name: "Concrete Vibrator",
        unit: "Day",
        hireRatePrice: 15000,
        number: 1
      },
      {
        name: "Cylindrical Rollers",
        unit: "Day",
        hireRatePrice: 500000,
        number: 1
      },
      {
        name: "Daihatsu",
        unit: "Day",
        hireRatePrice: 45000,
        number: 1
      },
      {
        name: "Excavator",
        unit: "Hr",
        hireRatePrice: 60000,
        number: 1
      },
      {
        name: "Gas",
        unit: "Day",
        hireRatePrice: 60000,
        number: 1
      },
      {
        name: "Gas (4Plates)",
        unit: "Nr",
        hireRatePrice: 120000,
        number: 1
      },
      {
        name: "Grader for subgrade",
        unit: "Hr",
        hireRatePrice: 60000,
        number: 1
      },
      {
        name: "Grader for subbase",
        unit: "Day",
        hireRatePrice: 60000,
        number: 1
      },
      {
        name: "Grader for base",
        unit: "Day",
        hireRatePrice: 60000,
        number: 1
      },
      {
        name: "Low Bed",
        unit: "Day",
        hireRatePrice: 600000,
        number: 1
      },
      {
        name: "Mechanical Saw",
        unit: "Day",
        hireRatePrice: 6000,
        number: 1
      },
      {
        name: "Road Painting Machine",
        unit: "Day",
        hireRatePrice: 45000,
        number: 1
      },
      {
        name: "Paver",
        unit: "Day",
        hireRatePrice: 1000000,
        number: 1
      },
      {
        name: "Truck with Crane",
        unit: "Day",
        hireRatePrice: 200000,
        number: 1
      },
      {
        name: "Tyre Roller",
        unit: "Day",
        hireRatePrice: 450000,
        number: 1
      },
      {
        name: "Walk Behind Compactor",
        unit: "Day",
        hireRatePrice: 50000,
        number: 1
      },
      {
        name: "Water Bowser for subgrade/base",
        unit: "Day",
        hireRatePrice: 150000,
        number: 1
      },
      {
        name: "Wheel Loader",
        unit: "Hr",
        hireRatePrice: 60000,
        number: 1
      },
      {
        name: "Stump Compactor for culvert installation",
        unit: "Day",
        hireRatePrice: 35000,
        number: 1
      },
      {
        name: "Tipper truck",
        unit: "Day",
        hireRatePrice: 160000,
        number: 1
      },
      {
        name: "Tipper truck for Dumping",
        unit: "Day",
        hireRatePrice: 160000,
        number: 1
      },
      {
        name: "Chip sealer machine",
        unit: "Day",
        hireRatePrice: 800000,
        number: 1
      },
      {
        name: "Water Bowser for Double layer",
        unit: "Day",
        hireRatePrice: 150000,
        number: 1
      },
      {
        name: "Walk Behind Compactor for double layer",
        unit: "Day",
        hireRatePrice: 50000,
        number: 1
      },
      {
        name: "Truck for 20-14mm and 10-7mm aggregate",
        unit: "Day",
        hireRatePrice: 160000,
        number: 1
      },
      {
        name: "Tyre Roller for Asphalt work",
        unit: "Day",
        hireRatePrice: 450000,
        number: 1
      },
      {
        name: "Double Drum Compactor for Asphalt",
        unit: "Day",
        hireRatePrice: 180000,
        number: 1
      },
      {
        name: "Tipper truck for Asphalt",
        unit: "Day",
        hireRatePrice: 160000,
        number: 1
      },
      {
        name: "Small Compressor machine for asphalt",
        unit: "Day",
        hireRatePrice: 200000,
        number: 1
      },
      {
        name: "Water Bowser for Asphalt",
        unit: "Day",
        hireRatePrice: 200000,
        number: 1
      },
      {
        name: "Walk Behind Compactor for Asphalt",
        unit: "Day",
        hireRatePrice: 50000,
        number: 1
      },
      {
        name: "Stump Compactor",
        unit: "Day",
        hireRatePrice: 35000,
        number: 1
      },
      {
        name: "Water Bowser for subBase/base",
        unit: "Day",
        hireRatePrice: 150000,
        number: 1
      },
      {
        name: "Excavator for Demolition works",
        unit: "Day",
        hireRatePrice: 60000,
        number: 1
      },
      {
        name: "Excavator with jack hummer",
        unit: "Hr",
        hireRatePrice: 80000,
        number: 1
      },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("equipments", null, {});
  },
};
