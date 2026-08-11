import jwt from "jsonwebtoken";

// VERIFY TOKEN – Middleware to check if the request has a valid JWT
export const verifyToken = (req, res, next) => {
  // Retrieve the Authorization header from the request
  const authHeader = req.headers.authorization;

  // Check if the Authorization header is missing
  // or does not start with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access token required" });
  }

  // Extract the token from the Bearer token
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};