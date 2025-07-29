const jwt = require("jsonwebtoken");
const { User, Role, Permission } = require("../models");

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Authentication token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Fetch user along with role and permissions
    const user = await User.findByPk(decoded.id, {
      include: {
        model: Role,
        as: "role",
        include: {
          model: Permission,
          as: "permissions",
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Build a flat list of permission strings: ["CREATE:invoice", "READ:user", ...]
    const permissions = (user.role?.permissions || []).map(
      (p) => `${p.action}:${p.resource}`
    );

    // Attach to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role?.name || null,
      permissions,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    return res
      .status(500)
      .json({ message: "Authentication failed", error: error.message });
  }
};
