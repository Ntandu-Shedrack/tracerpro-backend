"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Role.hasMany(models.User, {
        foreignKey: "roleId",
        as: "users",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      });
      Role.belongsToMany(models.Permission, {
        through: "RolePermissions",
        foreignKey: "roleId",
        otherKey: "permissionId",
        as: "permissions",
      });
    }
  }
  Role.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [1, 50],
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [0, 255],
        },
      },
    },
    {
      sequelize,
      modelName: "Role",
      tableName: "Roles",
      timestamps: true,
    }
  );
  return Role;
};
