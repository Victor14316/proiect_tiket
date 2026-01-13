const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const reservationsFile = path.join(__dirname, 'data', 'reservations.json');

// Endpoint pentru a obține rezervările
app.get('/api/reservations', (req, res) => {
    fs.readFile(reservationsFile, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Eroare la citirea rezervărilor');
        res.json(JSON.parse(data || '[]'));
    });
});

// Endpoint pentru a adăuga o rezervare
app.post('/api/reserve', (req, res) => {
    const reservation = req.body;
    fs.readFile(reservationsFile, 'utf8', (err, data) => {
        let reservations = [];
        if (!err && data) reservations = JSON.parse(data);
        reservations.push(reservation);
        fs.writeFile(reservationsFile, JSON.stringify(reservations, null, 2), err => {
            if (err) return res.status(500).send('Eroare la salvare');
            res.json({ success: true });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Serverul rulează pe http://localhost:${PORT}`);
});
