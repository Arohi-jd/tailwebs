import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export const generateToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
    },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
