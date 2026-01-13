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
        // Verifică dacă locul este deja rezervat pentru ziua și ora selectată
        const alreadyReserved = reservations.some(r =>
            r.seat == reservation.seat &&
            r.day === reservation.day &&
            r.hour === reservation.hour
        );
        if (alreadyReserved) {
            return res.status(400).json({ success: false, message: 'Locul este deja rezervat pentru această zi și oră!' });
        }
        reservations.push(reservation);
        fs.writeFile(reservationsFile, JSON.stringify(reservations, null, 2), err => {
            if (err) return res.status(500).send('Eroare la salvare');
            res.json({ success: true });
        });
    });
});

// Endpoint pentru a salva toate rezervările (rescriere completă)
app.post('/api/save-reservations', (req, res) => {
    const newReservations = req.body;
    fs.writeFile(reservationsFile, JSON.stringify(newReservations, null, 2), err => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

app.listen(PORT, () => {
    console.log(`Serverul rulează pe http://localhost:${PORT}`);
});
