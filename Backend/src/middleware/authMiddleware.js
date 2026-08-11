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

// IS ADMIN – Middleware to restrict access to admin users
export const isAdmin = (req, res, next) => {
  // Check if the authenticated user has ADMIN role
  if (req.user && req.user.role === "ADMIN") {
    // Allow admin users to continue
    next();
  } else {
    // Reject users without admin privileges
    res.status(403).json({
      message: "Admin access required",
    });
  }
};