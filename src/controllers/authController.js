const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { prisma } = require('../config/database');

const generateDeviceFingerprint = (userAgent) => {
  return crypto
    .createHash('sha256')
    .update(userAgent || '')
    .digest('hex')
    .substring(0, 32);
};

const getDeviceInfo = (req) => {
  const userAgent = req.headers['user-agent'] || '';
  let deviceName = 'Unknown Device';
  let deviceType = 'desktop';

  if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
    deviceType = 'mobile';
    if (userAgent.includes('iPhone')) {
      deviceName = 'iPhone';
    } else if (userAgent.includes('iPad')) {
      deviceName = 'iPad';
    } else if (userAgent.includes('Android')) {
      deviceName = 'Android Device';
    } else {
      deviceName = 'Mobile Device';
    }
  } else if (userAgent.includes('Mac') || userAgent.includes('Windows') || userAgent.includes('Linux')) {
    deviceType = 'desktop';
    if (userAgent.includes('Mac')) {
      deviceName = 'Macintosh';
    } else if (userAgent.includes('Windows')) {
      deviceName = 'Windows PC';
    } else if (userAgent.includes('Linux')) {
      deviceName = 'Linux PC';
    }
  } else if (userAgent.includes('Tablet')) {
    deviceType = 'tablet';
    deviceName = 'Tablet';
  }

  const deviceId = generateDeviceFingerprint(userAgent);

  return { deviceName, deviceType, deviceId };
};

/**
 * Generate JWT Token
 */
const generateAccessToken = (userId, email, role, deviceId) => {
  return jwt.sign(
    { userId, email, role, deviceId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
};

const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

const calculateRefreshTokenExpiry = () => {
  const expiresAt = new Date();
  const expiresInDays = parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '7', 10);
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);
  return expiresAt;
};

/**
 * User Registration (Signup)
 * POST /api/auth/signup
 */
const signup = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'user'
      }
    });

    const { deviceName, deviceType, deviceId } = getDeviceInfo(req);

    // Generate token
    const accessToken = generateAccessToken(user.id, user.email, user.role, deviceId);
    const refreshToken = generateRefreshToken();
    const refreshTokenExpiresAt = calculateRefreshTokenExpiry();

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        deviceId,
        deviceName,
        deviceType,
        expiresAt: refreshTokenExpiresAt
      }
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * User Login (Signin)
 * POST /api/auth/signin
 */
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const { deviceName, deviceType, deviceId } = getDeviceInfo(req);

    // Generate token
    const accessToken = generateAccessToken(user.id, user.email, user.role, deviceId);
    const refreshToken = generateRefreshToken();
    const refreshTokenExpiresAt = calculateRefreshTokenExpiry();

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        deviceId,
        deviceName,
        deviceType,
        expiresAt: refreshTokenExpiresAt
      }
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get Current User
 * GET /api/auth/me
 */
const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken: providedRefreshToken } = req.body;

    if (!providedRefreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: providedRefreshToken },
      include: { user: true }
    });

    if (!storedToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    if (storedToken.revoked) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token has been revoked'
      });
    }

    const now = new Date();
    if (now > storedToken.expiresAt) {
      await prisma.refreshToken.delete({
        where: { id: storedToken.id }
      });
      return res.status(401).json({
        success: false,
        message: 'Refresh token has expired'
      });
    }

    const newAccessToken = generateAccessToken(
      storedToken.user.id,
      storedToken.user.email,
      storedToken.user.role,
      storedToken.deviceId
    );
    const newRefreshToken = generateRefreshToken();
    const newRefreshTokenExpiresAt = calculateRefreshTokenExpiry();

    await prisma.$transaction([
      prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: {
          revoked: true,
          replacedByToken: newRefreshToken
        }
      }),
      prisma.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: storedToken.user.id,
          deviceId: storedToken.deviceId,
          deviceName: storedToken.deviceName,
          deviceType: storedToken.deviceType,
          expiresAt: newRefreshTokenExpiresAt
        }
      })
    ]);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

const logout = async (req, res) => {
  try {
    const userId = req.user.userId;
    const deviceId = req.user.deviceId;

    await prisma.refreshToken.updateMany({
      where: {
        userId: userId,
        deviceId: deviceId,
        revoked: false
      },
      data: { revoked: true }
    });

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

const logoutAll = async (req, res) => {
  try {
    const userId = req.user.userId;

    await prisma.refreshToken.updateMany({
      where: {
        userId: userId,
        revoked: false
      },
      data: { revoked: true }
    });

    res.status(200).json({
      success: true,
      message: 'Logged out from all devices successfully'
    });
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  signup,
  signin,
  getCurrentUser,
  refreshToken,
  logout,
  logoutAll
};
