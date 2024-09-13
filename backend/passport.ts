import passport from "passport";
import User from "./src/models/User";
const passportSetup = require("./passport");
const  GoogleStrategy = require('passport-google-oauth20').Strategy;

const  GOOGLE_CLIENT_ID ="146053191863-ho5vnnb06id57h1s7vm090n2m27ud3gu.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET ="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"


passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://www.example.com/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {

    try {
        // Check if user already exists in database based on Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // If user exists, return that user
          return cb(null, user);
        } else {
          // If user does not exist, create new user in database
          const newUser = new User({
            email: profile.emails[0].value,
            username: profile.displayName,
            userType: 'Vendor', // Example: Set the userType based on your application logic
            imageUrl: profile.photos[0].value, // Example: Set the imageUrl based on profile photo
            // googleId: profile.id,
            // Add other necessary fields
          });

          // Save new user to database
          user = await newUser.save();
          return cb(null, user);
        }
      } catch (err) {
        return cb(err, null);
      }
    }

));

passport.serializeUser((user: User, done) => {
    done(null, user.id); // Store user id in session
});
  passport.deserializeUser((id: string, done) => {
    User.findById(id, (err, user) => {
      done(err, user); // Retrieve user from MongoDB by id
    });
  });