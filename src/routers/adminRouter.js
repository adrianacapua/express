const express = require('express');
const { MongoClient } = require('mongodb');
const { databaseConfig } = require('../../config.json');
const sessions = require('../data/sessions.json');

const adminRouter = express.Router();

const { url, dbName } = databaseConfig;

adminRouter.route('/').get((req, res) => {
    

    (async function mongo() {
        let client;

        try {
            client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

            const db = client.db(dbName);

            const response = await db.collection('sessions').insertMany(sessions);

            // client.close();

            res.json(response);
        } catch (error) {
            console.log(error.stack);
        }
    })();
});

module.exports = adminRouter;