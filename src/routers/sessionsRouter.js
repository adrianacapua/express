const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const { session } = require('passport');
const { databaseConfig } = require('../../config.json');
const sessions = require('../data/sessions.json');
const sessionRouter = express.Router();

const { url, dbName } = databaseConfig;

sessionRouter.use((req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect('auth/signin');
    }
});

sessionRouter.route('/')
.get(async (req, res) => {

    (async function mongo() {
        let client;

        try {
            client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

            const db = client.db(dbName);

            const sessions = await db.collection('sessions').find().toArray();

            res.render('sessions', { sessions });
        } catch (error) {
            console.log(error.stack);
        }
    })();
});

sessionRouter.route('/:id').get((req, res) => {
    const id = req.params.id;

    (async function mongo() {
        let client;

        try {
            client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

            const db = client.db(dbName);
            const session = await db.collection('sessions').findOne({ _id: ObjectId(id) })

            res.render('session', { session });
        } catch (error) {
            console.log(error.stack);
        }
    })();
});

module.exports = sessionRouter;