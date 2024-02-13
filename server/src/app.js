const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

const api = require('./routes/api');

app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/v1',api);


app.get('/*', (req, res) => {
    const indexPath = path.join(__dirname, '..', 'public', 'index.html');

    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(err.status).end();
        } else {
            console.log('Sent:', indexPath);
        }
    });
});

module.exports = app;
