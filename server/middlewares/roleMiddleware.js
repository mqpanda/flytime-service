import jwt from 'jsonwebtoken';

export const checkUserRole = (allowedRoles) => {
  return (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log(decoded);

        if (allowedRoles.includes(decoded.role)) {
          req.userId = decoded._id;
          next();
        } else {
          return res.status(403).json({
            message: 'No access - Insufficient role',
          });
        }
      } catch (e) {
        return res.status(403).json({
          message: 'No access - Invalid token',
        });
      }
    } else {
      return res.status(403).json({
        message: 'No access - Missing token',
      });
    }
  };
};
