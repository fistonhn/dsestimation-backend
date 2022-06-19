module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("units", [
      { symbol: "ha", meaning: "hectare" },
      { symbol: "hr", meaning: "hour" },
      { symbol: "kg", meaning: "kilogramme" },
      { symbol: "kn", meaning: "kilonewton" },
      { symbol: "kw", meaning: "kilowatt" },
      { symbol: "m", meaning: "linear meter" },
      { symbol: "m2", meaning: "Square meter" },
      { symbol: "t", meaning: "tonne" },
      { symbol: "wk", meaning: "week" },
      { symbol: "Pcsum", meaning: "Prime cost sum" },
      { symbol: "Pc price", meaning: "Prime cost price" },
      { symbol: "Bag", meaning: "Bag" },
      { symbol: "Pcs", meaning: "Piece" },
      { symbol: "Set", meaning: "Sets" },
      { symbol: "Pkt", meaning: "Packet" },
      { symbol: "m3", meaning: "cubic metre" },
      { symbol: "ltr", meaning: "Litre" },
      { symbol: "Ls", meaning: "Lump sum" },
      { symbol: "Hr", meaning: "Hour" },
      { symbol: "Day", meaning: "Day" },
      { symbol: "Month", meaning: "Month" },
      { symbol: "Year", meaning: "Year" },
      { symbol: "nr", meaning: "number" },
      { symbol: "Hr", meaning: "Hour" },
      { symbol: "Day", meaning: "Day" },
      { symbol: "Month", meaning: "Month" },
      { symbol: "Year", meaning: "Year" },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("units", null, {});
  },
};
