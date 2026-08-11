import jwt from "jsonwebtoken";

// VERIFY TOKEN – Middleware to check if the request has a valid JWT
export const verifyToken = (req, res, next) => {
  // Retrieve the Authorization header from the request
  const authHeader = req.headers.authorization;

  // Check if the Authorization header is missing
  // or does not start with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Access token required",
    });
  }

  // Extract the token from the Bearer token
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the access token secret
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    // Attach decoded user information to req.user
    // so that routes can access the user's id and role
    req.user = decoded;

    // Continue to the next middleware or route
    next();
  } catch (error) {
    // Return unauthorized response if the token is invalid or expired
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};