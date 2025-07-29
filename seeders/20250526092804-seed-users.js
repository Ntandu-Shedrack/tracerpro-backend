"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("P@$$w0rd", 10);
    const timestamp = new Date();

    await queryInterface.bulkInsert("Users", [
      {
        id: 1,
        name: "Admin User",
        gender: "other",
        language: "en",
        email: "admin@admin.com",
        phone: "1234567890",
        password: hashedPassword,
        roleId: 1,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: 2,
        name: "Regular User",
        gender: "other",
        language: "en",
        email: "user@regular.com",
        phone: "1234567891",
        password: hashedPassword,
        roleId: 2,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
