module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("users", [
      {
        name: "Demo Owner",
        email: "owner12@test.com",
        password:
          "$2a$10$k.INw011LiKvSO23zm6pUuD55.EkvgegWo0vk3amL07DAM.dFtyfu",
        role: "owner",
        isConfirmed: true,
      },
      {
        name: "Jane Smith",
        email: "manager12@test.com",
        password:
          "$2a$10$k.INw011LiKvSO23zm6pUuD55.EkvgegWo0vk3amL07DAM.dFtyfu",
        role: "manager",
        isConfirmed: true,
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
