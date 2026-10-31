import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

import {ENV} from '../config/env.js';
import User from '../models/user.model.js';

export const protectRoute = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: 'Unauthorized - Please login first.',
    });
  }

  const decoded = jwt.verify(token, ENV.JWT_SECRET);

  const user = await User.findById(decoded.userId).select('-password');

  console.log('AUTHENTICATED USER:', {
    id: user?._id,
    email: user?.email,
  });

  if (!user) {
    return res.status(401).json({
      message: 'User not found.',
    });
  }

  req.user = user;

  next();
});
