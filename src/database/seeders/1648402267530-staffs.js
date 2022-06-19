module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("staffs", [
      {
        name: "John Doe",
        email: "admin12@test.com",
        password:
          "$2a$10$k.INw011LiKvSO23zm6pUuD55.EkvgegWo0vk3amL07DAM.dFtyfu",
        role: "admin",
        isConfirmed: true,
        managerId: 2,
      },

      {
        name: "Domenic Smith",
        email: "manager132@test.com",
        password:
          "$2a$10$k.INw011LiKvSO23zm6pUuD55.EkvgegWo0vk3amL07DAM.dFtyfu",
        role: "admin",
        isConfirmed: false,
        managerId: 2,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("staffs", null, {});
  },
};
