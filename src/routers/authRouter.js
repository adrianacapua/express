const express = require('express');
const passport = require('passport');
const { MongoClient, ObjectId } = require('mongodb');
const { databaseConfig } = require('../../config.json');
const authRouter = express.Router();

const { url, dbName } = databaseConfig;

authRouter.route('/signUp').post((req, res) => {
    const { username, password } = req.body;
    (async function mongo() {
        let client;

        try {
            client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

            const db = client.db(dbName);
            const user = { username, password };

            const result = await db.collection('users').insertOne(user);

            const { _id } = result;

            req.login({
                username,
                password,
                _id: ObjectId(_id).toString()
            }, () => {
                res.redirect('/auth/profile');
            });
        } catch (error) {
            console.log(error.stack);
        }
    })();
});

authRouter.route('/signin')
    .get((req, res) => {
        res.render('signin');
    })
    .post(passport.authenticate('local', {
        successRedirect: '/auth/profile',
        failureRedirect: '/'
    }));

authRouter.route('/profile').get((req, res) => {
    res.json(req.user);
});

module.exports = authRouter;