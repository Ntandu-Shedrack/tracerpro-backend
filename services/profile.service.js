const { User } = require("../models");

exports.getUserProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: [
      "name",
      "gender",
      "language",
      "email",
      "phone",
      "profileImage",
      "role",
      "createdAt",
      "updatedAt",
    ],
  });

  return user;
};

exports.updateUserProfile = async (userId, updateData) => {
  const user = await User.findByPk(userId);
  if (!user) return null;

  const allowedFields = [
    "name",
    "gender",
    "language",
    "email",
    "phone",
    "profileImage",
  ];
  const filteredData = {};

  for (const key of allowedFields) {
    if (updateData[key] !== undefined) {
      filteredData[key] = updateData[key];
    }
  }

  const updatedUser = await user.update(filteredData);
  return updatedUser;
};

exports.uploadProfileImage = async (userId, imageUrl, uploadType) => {
  const user = await User.findByPk(userId);
  if (!user) return null;

  user.profileImage = imageUrl;
  await user.save();

  return imageUrl;
};
