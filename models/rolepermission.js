"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //
      // Join table for Role <-> Permission
      RolePermission.belongsTo(models.Role, {
        foreignKey: "roleId",
        as: "role",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      RolePermission.belongsTo(models.Permission, {
        foreignKey: "permissionId",
        as: "permission",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  RolePermission.init(
    {
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Roles", // Name of the target model
          key: "id", // Key in the target model
        },
        validate: {
          notEmpty: true,
          isInt: true,
        },
      },
      permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Permissions", // Name of the target model
          key: "id", // Key in the target model
        },
        validate: {
          notEmpty: true,
          isInt: true,
        },
      },
    },
    {
      sequelize,
      modelName: "RolePermission",
      tableName: "RolePermissions",
      timestamps: true,
    }
  );
  return RolePermission;
};
