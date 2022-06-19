module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("sub_contractors", [
      {
        name: "Roads regulatory signs",
        unit: "Pcs",
        quantity: 1,
        price: 156060
      },
      {
        name: "Roads warning signs",
        unit: "Pcs",
        quantity: 1,
        price: 156060
      },
      {
        name: "Direction and indication signs",
        unit: "Pcs",
        quantity: 1,
        price: 156060,
      },
      {
        name: "Retro reflective white or yellow paint line of 0.18 width",
        unit: "m2",
        quantity: 1,
        price: 14280,
      },
      {
        name: "Retro reflective white  paint line of 0.12width",
        unit: "m2",
        quantity: 1,
        price: 14280,
      },
      {
        name: "Special marking in white retro reflective paint",
        unit: "m2",
        quantity: 1,
        price: 14280,
      },
      {
        name: "Black and White-painted for Curbs",
        unit: "m2",
        quantity: 1,
        price: 14280,
      },
      {
        name: "Double Arm, reinforced concrete pole, with simple sticks color (H=9m) on concrete base (0.50mx0.50mx1.50m)",
        unit: "Pcs",
        quantity: 1,
        price: 339667.48305,
      },
      {
        name: "Diffusers (LED : light emitting diode)",
        unit: "Pcs",
        quantity: 1,
        price: 139873.700925,
      },
      {
        name: "Buried cable B.T 4x35mm² and given in a state of places",
        unit: "m",
        quantity: 1,
        price: 27906.28155,
      },
      {
        name: "Buried cable B.T 4x25mm² and given in a state of places",
        unit: "m",
        quantity: 1,
        price: 18560.378025,
      },
      {
        name: "Flexible cable BT 3x2.5mm²",
        unit: "m",
        quantity: 1,
        price: 5398.69995,
      },
      {
        name: "Electrical power box with foundation",
        unit: "Pcs",
        quantity: 1,
        price: 866565,
      },
      {
        name: "Fixing of ground 16mm2 stakes x 1.5m (height)",
        unit: "Pcs",
        quantity: 1,
        price: 28885,
      },
      {
        name: "Wire of Cu ground 1x25mm²",
        unit: "m",
        quantity: 1,
        price: 3539.918025,
      },
      {
        name: "Insulation of the poinst of connected to the insulating poteaux (Toiles)",
        unit: "Ls",
        quantity: 1,
        price: 1000000,
      },
      {
        name: "Power transformer 50KVA/30KV",
        unit: "Pcs",
        quantity: 1,
        price: 8954505,
      },
      {
        name: "Landscaping, planting trees and fixing grasses on both sides of the road.",
        unit: "m2",
        quantity: 1,
        price: 3500,
      },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("sub_contractors", null, {});
  },
};
