const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const DB_NAME = 'TrujilloMunicipalLibrary';

// Solo inicializar si tenemos las credenciales y no estamos en test
if (process.env.NODE_ENV !== 'test' && process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      const client = mongodb.getDatabase();
      const db = client.db(DB_NAME);
      const usersCollection = db.collection('users');

      let user = await usersCollection.findOne({ googleId: profile.id });

      if (!user) {
        const newUser = {
          googleId: profile.id,
          firstName: profile.displayName ? profile.displayName.split(' ')[0] : profile.username,
          lastName: profile.displayName ? profile.displayName.split(' ').slice(1).join(' ') : '',
          email: profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.com`,
          role: 'member',
          status: 'active',
          membershipDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const result = await usersCollection.insertOne(newUser);
        user = { ...newUser, _id: result.insertedId };
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user._id.toString());
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const client = mongodb.getDatabase();
      const db = client.db(DB_NAME);
      const usersCollection = db.collection('users');
      
      const user = await usersCollection.findOne({ _id: new ObjectId(id) });
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}

module.exports = passport;