"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Permission.belongsToMany(models.Role, {
        through: "RolePermissions",
        foreignKey: "permissionId",
        otherKey: "roleId",
        as: "roles",
      });
    }
  }
  Permission.init(
    {
      action: {
        type: DataTypes.ENUM,
        values: ["CREATE", "READ", "EDIT", "DELETE"],
        allowNull: false,
        validate: {
          notEmpty: true,
          isIn: {
            args: [["CREATE", "READ", "EDIT", "DELETE"]],
            msg: "Action must be one of CREATE, READ, EDIT, DELETE",
          },
        },
      },
      resource: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 50],
        },
      },
    },
    {
      sequelize,
      modelName: "Permission",
      tableName: "Permissions",
      timestamps: true,
    }
  );
  return Permission;
};
