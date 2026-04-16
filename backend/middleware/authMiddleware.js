const jwt = require('jsonwebtoken');

// 1. Verify Token Middleware
const verifyToken = (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify token using secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded payload (id, role) to the request object
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// 2. Role Authorization Middleware
// Usage example: authorizeRoles('admin')
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user is populated by verifyToken
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Forbidden. You do not have permission to perform this action.' 
      });
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRoles };