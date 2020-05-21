const express = require('express');
const router = express.Router();
const _ = require('lodash');
const sgMail = require('@sendgrid/mail');
const config = require('../config/key');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const { auth } = require('../middleware/auth');
sgMail.setApiKey(config.SEND_GRID_MAIL_KEY);

//=================================
//             User
//=================================

// Auth route
router.get('/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    // lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

// Register route
router.post('/register', async (req, res) => {
  const user = new User(req.body);

  await user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
      userData: doc,
    });
  });
});

// Login route
router.post('/login', async (req, res) => {
  await User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: 'Auth failed, email not found',
      });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: 'Wrong password' });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie('w_authExp', user.tokenExp);
        res.cookie('w_auth', user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        });
      });
    });
  });
});

// Logout route
router.get('/logout', auth, async (req, res) => {
  await User.findOneAndUpdate(
    { _id: req.user._id },
    { token: '', tokenExp: '' },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});

// Forgot password route
router.put('/forgot-password', async (req, res) => {
  const { email } = req.body;

  await User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        message: 'User with that email does not exist',
      });
    }

    const token = jwt.sign({ _id: user._id }, config.JWT_RESET_PASSWORD, {
      expiresIn: '30m',
    });

    const emailData = {
      from: config.EMAIL_FROM,
      to: email,
      subject: 'Gallery-X Password Reset link',
      html: `
                  <p>Dear ${user.name},</p>
                  <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
                  <p>Please click on the following link, or paste this into your browser to complete the process within 30 minutes of receiving it:</p>
                  <p>${config.CLIENT_URL}/users/password/reset/${token}</p>
                  <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
                  <p>Thank you for using Gallery-X.</p>
                  <p>Sincerely,<br>The Gallery-X Team</p>
              `,
    };

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        console.log('RESET PASSWORD LINK ERROR', err);
        return res.status(400).json({
          message: 'Database connection error on user password forgot request',
        });
      } else {
        sgMail
          .send(emailData)
          .then((sent) => {
            // console.log('SIGNUP EMAIL SENT', sent);
            return res.json({
              success: true,
              message: `An email has been sent to ${email}. Follow the instruction to reset your password for your account`,
            });
          })
          .catch((err) => {
            // console.log('SIGNUP EMAIL SENT ERROR', err);
            return res.json({
              message: err.message,
            });
          });
      }
    });
  });
});

// Reset password route
router.put('/reset-password', async (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;
  if (resetPasswordLink) {
    jwt.verify(resetPasswordLink, config.JWT_RESET_PASSWORD, function (
      err,
      decoded
    ) {
      if (err) {
        return res.status(400).json({
          message: 'Expired link. Try again',
        });
      }

      User.findOne({ resetPasswordLink }, (err, user) => {
        if (err || !user) {
          return res.status(400).json({
            message: 'Something went wrong. Try later',
          });
        }

        const updatedFields = {
          password: newPassword,
          resetPasswordLink: '',
        };

        user = _.extend(user, updatedFields);

        user.save((err, result) => {
          if (err) {
            return res.status(400).json({
              message: 'Error resetting user password',
            });
          }
          res.json({
            success: true,
            message: 'Your password has been reset! You can login now.',
          });
        });
      });
    });
  }
});

// router.post('/addToCart', auth, (req, res) => {
//   User.findOne({ _id: req.user._id }, (err, userInfo) => {
//     let duplicate = false;

//     console.log(userInfo);

//     userInfo.cart.forEach((item) => {
//       if (item.id == req.query.productId) {
//         duplicate = true;
//       }
//     });

//     if (duplicate) {
//       User.findOneAndUpdate(
//         { _id: req.user._id, 'cart.id': req.query.productId },
//         { $inc: { 'cart.$.quantity': 1 } },
//         { new: true },
//         (err, userInfo) => {
//           if (err) return res.json({ success: false, err });
//           res.status(200).json(userInfo.cart);
//         }
//       );
//     } else {
//       User.findOneAndUpdate(
//         { _id: req.user._id },
//         {
//           $push: {
//             cart: {
//               id: req.query.productId,
//               quantity: 1,
//               date: Date.now(),
//             },
//           },
//         },
//         { new: true },
//         (err, userInfo) => {
//           if (err) return res.json({ success: false, err });
//           res.status(200).json(userInfo.cart);
//         }
//       );
//     }
//   });
// });

module.exports = router;
