const passport = require('passport');
const { MongoClient, ObjectId } = require('mongodb');
const { Strategy } = require('passport-local');
const { databaseConfig } = require('../../../config.json');

const { url, dbName } = databaseConfig;

module.exports = function localStrategy() {
    passport.use(new Strategy({ 
        usernameField: 'username',
        passwordField: 'password'
     }, (username, password, done) => {
        (async function mongo() {
            let client;
    
            try {
                client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    
                const db = client.db(dbName);
                
                const user = await db.collection('users').findOne({ username });

                if (user && user.password === password) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            } catch (error) {
                done(error, false);
            }
        })();
     }))
}