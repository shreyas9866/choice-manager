const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get the token from the header (usually sent as "Bearer [token]")
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied.' });
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the user ID to the request object so our routes can use it
    req.user = decoded.userId; 
    next(); // Pass control to the next function/route
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid.' });
  }
};