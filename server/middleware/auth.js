import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authorization token missing or malformed',
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'chaichukta-jwt-secret-dev';

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (jwtErr) {
      return res.status(401).json({
        success: false,
        error: jwtErr.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
      });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User belonging to this token no longer exists',
      });
    }

    req.user = {
      id: user._id.toString(),
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Authentication error: ' + error.message,
    });
  }
}

export default authMiddleware;
