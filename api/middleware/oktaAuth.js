const okta = require('@okta/okta-sdk-nodejs');
const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' });

const client = new okta.Client({
  orgUrl: process.env.OKTA_REGISTRATION_URL,
  token: process.env.OKTA_REGISTRATION_TOKEN,
});

const registerOktaUser = async (req, res, next) => {
  const tempPassword = Math.random().toString(36).slice(-8);
  const newUser = {
    profile: {
      firstName: req.body.first_name,
      lastName: req.body.last_name,
      email: req.body.email,
      login: req.body.email,
    },
    credentials: {
      password: {
        // this must be made available to admins.
        // approved users should be prompted to rewrite this value.
        value: tempPassword,
      },
    },
  };

  await client.createUser(newUser).then((user) => {
    console.log('Created user', user);
    next();
  });
};

module.exports = { registerOktaUser };