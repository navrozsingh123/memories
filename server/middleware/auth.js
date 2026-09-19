import jwt from 'jsonwebtoken';

// Verifies the app's own JWT and attaches the user id to the request.
// Google sign-ins are exchanged for an app token at /users/google, so every
// request that reaches here carries a token this server issued.
const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith('Bearer '))
      return res.status(401).json({ message: 'Unauthenticated.' });

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    req.userName = decoded.name;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError')
      return res.status(401).json({ message: 'Session expired. Please sign in again.' });

    res.status(401).json({ message: 'Unauthenticated.' });
  }
};

export default auth;
