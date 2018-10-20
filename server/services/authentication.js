'use strict';

const jwt = require('jsonwebtoken');
const passport = require('passport');

class AuthenticationService {
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
    const user = this._getUser(req);
    user ? this._refreshToken(user, res) : res.send({ success: false });
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
      const user = this._getUser(req);
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
      const user = this._getUser(req);
      if (
        user.id.toString() === req.params.id ||
        user.roles.find(r => r === role)
      ) {
        next();
      } else {
        res.status(403);
        res.end();
      }
    };
  }

  isAuthenticated(req) {
    return !!this._getUser(req);
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

  _getUser(req) {
    try {
      return this.verifyToken(req);
    } catch (err) {}
  }

  _refreshToken(user, res) {
    delete user.exp;
    delete user.iat;
    const token = this._generateToken(user);
    res.send({
      success: true,
      user: user,
      token: token
    });
  }
}

module.exports = new AuthenticationService();
