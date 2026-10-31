import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

import {ENV} from '../config/env.js';
import User from '../models/user.model.js';

const generateToken = (userId, res) => {
  const token = jwt.sign(
      {userId}, ENV.JWT_SECRET, {expiresIn: ENV.JWT_EXPIRES_IN || '1d'});

  res.cookie('token', token, {
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });
};

export const signup = asyncHandler(async (req, res) => {
  const {name, email, password} = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'All fields are required.',
    });
  }

  const existingUser = await User.findOne({email});

  if (existingUser) {
    return res.status(409).json({
      message: 'Email already registered.',
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  generateToken(user._id, res);

  return res.status(201).json({
    message: 'Account created successfully.',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required.',
    });
  }

  const user = await User.findOne({email});

  if (!user) {
    return res.status(401).json({
      message: 'Invalid email or password.',
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(401).json({
      message: 'Invalid email or password.',
    });
  }

  generateToken(user._id, res);

  return res.status(200).json({
    message: 'Login successful.',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return res.status(200).json({
    message: 'Logged out successfully.',
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json({
    user: req.user,
  });
});
