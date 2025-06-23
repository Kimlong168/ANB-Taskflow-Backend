const User = require("./user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { blacklistedTokens } = require("@/middlewares/auth.middleware");
const { successResponse, errorResponse } = require("@/utils/response-helpers");
const { uploadImage, deleteImage } = require("@/utils/upload-image");

exports.register = async (req, res, next) => {
  let image = { secure_url: null };
  try {
    const existing = await User.findOne({ email: req.body.email });

    if (existing) {
      return errorResponse(res, "User already exists", 400);
    }

    if (req.file) {
      image = await uploadImage(req.file.path);
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const userData = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      profilePicture: image.secure_url,
    };

    const user = new User(userData);

    await user.save();

    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    const refreshToken = jwt.sign(
      { name: user.name, email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "5d" }
    );

    successResponse(
      res,
      {
        user,
        token,
        refreshToken,
      },
      "Registration successful"
    );
  } catch (err) {
    if (req.file) {
      await deleteImage(image.secure_url);
    }
    next(err);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return errorResponse(res, "Invalid credentials", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return errorResponse(res, "Invalid credentials", 401);
  }

  const token = jwt.sign(
    {
      name: user.name,
      email: user.email,
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "3d" }
  );

  const refreshToken = jwt.sign(
    { name: user.name, email: user.email, id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "5d" }
  );

  successResponse(
    res,
    {
      user,
      token,
      refreshToken,
    },
    "Login successful"
  );
};

exports.logout = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return errorResponse(res, "Failed to log out", 400);
  }

  blacklistedTokens.add(token);
  return successResponse(res, null, "User has logged out successfully");
};

exports.refreshToken = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const refreshToken = authHeader && authHeader.split(" ")[1];
  let userData;
  try {
    userData = await User.findOne({ email: req.user.email });
    if (!userData) {
      return errorResponse(res, "User not found", 404);
    }
  } catch (err) {
    return errorResponse(res, "User not found", 404);
  }

  if (refreshToken) {
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {
      if (err) return errorResponse(res, "Unauthorized", 401);
      const newToken = jwt.sign(
        {
          name: userData.name,
          email: userData.email,
          id: userData._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "3d",
        }
      );
      const newRefreshToken = jwt.sign(
        {
          name: userData.name,
          email: userData.email,
          id: userData._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "5d",
        }
      );
      successResponse(
        res,
        { token: newToken, refreshToken: newRefreshToken, user: userData },
        "Token refreshed successfully"
      );
    });
  } else {
    errorResponse(res, "No token provided", 400);
  }
};
