import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User.js';
import { ENV } from '../config/env.js';
import { AuthRequest } from '../middleware/auth.js';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const generateToken = (userId: string, role: string) => {
  return jwt.sign({ id: userId, role }, ENV.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const parsed = registerSchema.parse(req.body);

  const existingUser = await User.findOne({ email: parsed.email.toLowerCase() });
  if (existingUser) {
    res.status(400).json({ success: false, message: 'An account with this email already exists' });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(parsed.password, salt);

  const user = await User.create({
    name: parsed.name,
    email: parsed.email.toLowerCase(),
    phone: parsed.phone,
    passwordHash,
    role: 'user',
  });

  const token = generateToken(user._id.toString(), user.role);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      posterQuota: user.posterQuota,
    },
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const parsed = loginSchema.parse(req.body);

  const user = await User.findOne({ email: parsed.email.toLowerCase() });
  if (!user) {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
    return;
  }

  const isMatch = await bcrypt.compare(parsed.password, user.passwordHash);
  if (!isMatch) {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
    return;
  }

  const token = generateToken(user._id.toString(), user.role);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      posterQuota: user.posterQuota,
    },
  });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      posterQuota: req.user.posterQuota,
    },
  });
};
