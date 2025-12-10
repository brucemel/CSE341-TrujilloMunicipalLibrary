const githubAuth = (req, res, next) => {
};

const githubCallback = (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login Successful</title>
    </head>
      <h1>You are logged in, ${req.user.firstName}!</h1>
      <p>Welcome to Biblioteca Municipal de Trujillo</p>
    </html>
  `;
  
  res.send(html);
};

const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        error: 'Logout failed',
        message: err.message
      });
    }
    
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Logged Out</title>
      </head>
        <h1>You are logged out!</h1>
      </html>
    `;
    
    res.send(html);
  });
};

const getCurrentUser = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        role: req.user.role,
        status: req.user.status
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }
};

const getAuthStatus = (req, res) => {
  res.json({
    isAuthenticated: req.isAuthenticated(),
    user: req.isAuthenticated() ? {
      id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      role: req.user.role
    } : null
  });
};

module.exports = {
  githubAuth,
  githubCallback,
  logout,
  getCurrentUser,
  getAuthStatus
};