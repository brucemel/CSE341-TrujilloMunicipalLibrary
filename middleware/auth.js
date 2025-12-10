const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({
    error: 'Unauthorized',
    message: 'You must be logged in to access this resource'
  });
};

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    error: 'Forbidden',
    message: 'You do not have permission to access this resource. Admin access required.'
  });
};

const isMember = (req, res, next) => {
  if (req.isAuthenticated() && (req.user.role === 'member' || req.user.role === 'admin')) {
    return next();
  }
  return res.status(403).json({
    error: 'Forbidden',
    message: 'You must be a member to access this resource'
  });
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isMember
};