'use strict';

const jwt = require('jsonwebtoken');
const passport = require('passport');

module.exports = class AuthenticationService {
  authenticate(req, res, next) {
    const auth = passport.authenticate('local', (err, user) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.send({ success: false });
      }

      req.logIn(user, err => {
        if (err) {
          return next(err);
        }

        const token = this._generateToken(user, process.env.JWT_PRIVATE_KEY, {
          expiresIn: '10d'
        });

        res.send({
          success: true,
          user: user,
          token: token
        });
      });
    });

    auth(req, res, next);
  }

  refresh(req, res) {
    try {
      this._refreshToken(req, res);
    } catch (err) {
      res.send({ success: false });
    }
  }

  requireApiLogin(req, res, next) {
    if (this.isAuthenticated(req)) {
      next();
    } else {
      res.status(401);
      res.end();
    }
  }

  requireRole(role) {
    return (req, res, next) => {
      const user = this.verifyToken(req);
      if (user.roles.find(r => r === role)) {
        next();
      } else {
        res.status(403);
        res.end();
      }
    };
  }

  requireRoleOrId(role) {
    return (req, res, next) => {
      const user = this.verifyToken(req);
      if (user.id.toString() === req.params.id || user.roles.find(r => r === role)) {
        next();
      } else {
        res.status(403);
        res.end();
      }
    };
  }

  isAuthenticated(req) {
    try {
      this.verifyToken(req);
    } catch (err) {
      return false;
    }
    return true;
  }

  verifyToken(req) {
    const currentToken = this._getCurrentToken(req);
    return jwt.verify(currentToken, process.env.JWT_PRIVATE_KEY);
  }

  _generateToken(user) {
    return jwt.sign(user, process.env.JWT_PRIVATE_KEY, {
      expiresIn: '10d'
    });
  }

  _getCurrentToken(req) {
    return req.headers.authorization && req.headers.authorization.split(' ')[1];
  }

  _refreshToken(req, res) {
    let user = this.verifyToken(req);
    delete user.exp;
    delete user.iat;
    const token = this._generateToken(user);
    res.send({
      success: true,
      user: user,
      token: token
    });
  }
};
