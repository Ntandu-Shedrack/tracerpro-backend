const { Model } = require("sequelize");

("use strict");

module.exports = (sequelize, DataTypes) => {
  class PasswordReset extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here if needed
      // Example: this.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  PasswordReset.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
          notEmpty: true,
        },
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      modelName: "PasswordReset",
      timestamps: true,
    }
  );

  return PasswordReset;
};
