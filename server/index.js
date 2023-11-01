import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import pkg from 'pg';
import Redis from 'ioredis';
import {
    pgUser,
    pgHost,
    pgDatabase,
    pgPassword,
    pgPort,
    redisHost,
    redisPort
} from './keys.js';

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(bodyParser.json());

// PG
const pgClient = new Pool({
    user: pgUser,
    host: pgHost,
    database: pgDatabase,
    password: pgPassword,
    port: pgPort
});

pgClient.connect()
    .then(() => {
        pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)')
            .catch((err) => console.error(err));
    })
    .catch((err) => {
        console.error(err);
    });

// Redis
const redisClient = new Redis({
    host: redisHost,
    port: redisPort,
});

const redisPublisher = redisClient.duplicate();

// Route handlers
app.get('/', (req, res) => {
    res.send('API');
});

app.get('/values/all', async (req, res) => {
    try {
        const values = await pgClient.query('SELECT * FROM values');
        res.send(values.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/values', async (req, res) => {
    const index = req.body.index;

    if (parseInt(index) > 40) {
        return res.status(422).send('Index too high');
    }

    redisClient.hset('values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

    res.send({ working: true });
});

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
});


// Port
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Handle closing the Redis client gracefully on application shutdown
process.on('SIGINT', () => {
    redisClient.quit(() => {
        process.exit();
    });
});
