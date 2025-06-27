const roleMapping = {
  admin: process.env.ADMIN_ROLE_ID, // Admin rolüne karşılık gelen ID
  author: process.env.AUTHOR_ROLE_ID, // Author rolüne karşılık gelen ID
};

export const isAdmin = (req, res, next) => {
  if (req.user.roleId !== roleMapping.admin) {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

export const isAuthor = (req, res, next) => {
  if (req.user.roleId !== roleMapping.author) {
    return res.status(403).json({ message: 'Access denied. Authors only.' });
  }
  next();
};