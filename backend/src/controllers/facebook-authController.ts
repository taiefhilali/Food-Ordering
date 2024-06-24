import passport from 'passport';
const FacebookStrategy = require('passport-facebook').Strategy;
import express, { Request, Response } from 'express'; // Import Request and Response types from express
import session from 'express-session'; // Import express-session
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const router = express.Router();

// Initialize express-session middleware
router.use(session({
  secret: process.env.SESSION_SECRET || 'secret', // Replace with your own session secret
  resave: false,
  saveUninitialized: false,
}));

// Passport middleware initialization should come after session middleware
router.use(passport.initialize());
router.use(passport.session());

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_SECRET_KEY || '',
      callbackURL: process.env.FACEBOOK_CALLBACK_URL || '',
    },
    async function (accessToken: string, refreshToken: string, profile: any, cb: any) {
      const user = await User.findOne({
        accountId: profile.id,
        provider: 'facebook',
      });
      if (!user) {
        console.log('Adding new facebook user to DB..');
        const newUser = new User({
          accountId: profile.id,
          name: profile.displayName,
          provider: profile.provider,
        });
        await newUser.save();
        return cb(null, profile);
      } else {
        console.log('Facebook User already exists in DB..');
        return cb(null, profile);
      }
    }
  )
);

// Serialize and deserialize user for session management
passport.serializeUser<any, any>((user, done) => {
  done(null, user);
});

passport.deserializeUser<any, any>((user, done) => {
  done(null, user);
});

router.get('/', passport.authenticate('facebook', { scope: 'email' }));

router.get(
  '/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/auth/facebook/error',
  }),
  function (req: Request, res: Response) {
    // Successful authentication, redirect to success screen.
    res.redirect('/auth/facebook/success');
  }
);

router.get('/success', async (req: Request, res: Response) => {
  if (req.session && req.session.passport && req.session.passport.user) {
    const userInfo = {
      id: req.session.passport.user.id,
      displayName: req.session.passport.user.displayName,
      provider: req.session.passport.user.provider,
    };
    res.render('fb-github-success', { user: userInfo });
  } else {
    res.redirect('/auth/facebook/error');
  }
});

router.get('/error', (req: Request, res: Response) => res.send('Error logging in via Facebook..'));

router.get('/signout', (req: Request, res: Response) => {
  try {
    req.session.destroy(function (err) {
      console.log('session destroyed.');
    });
    res.render('auth');
  } catch (err) {
    res.status(400).send({ message: 'Failed to sign out fb user' });
  }
});

module.exports = router;
