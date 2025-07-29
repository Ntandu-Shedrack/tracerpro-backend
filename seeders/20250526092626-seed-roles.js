"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     */
    await queryInterface.bulkInsert(
      "Roles",
      [
        {
          id: 1,
          name: "Admin",
          description: "Administrator with full access",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "User",
          description: "Regular user with limited access",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
    await queryInterface.bulkDelete("Roles", null, {});
  },
};
