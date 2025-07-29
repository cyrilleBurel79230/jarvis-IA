// cave-server.js
const express = require('express');
const app = express();
const port = 3000;

const zones = [
  { id: 1, name: 'Zone A', description: 'Vins rouges anciens', bottles: 24 ,status: 'mature'},
  { id: 2, name: 'Zone B', description: 'Blancs moelleux', bottles: 12 ,status: 'mature'},
  { id: 3, name: 'Zone C', description: 'Champagnes et effervescents', bottles: 30,status: 'mature' }
];

app.use(express.json());

// GET toutes les zones
app.get('/api/cave', (req, res) => {
  res.json(zones);
});

// GET une zone spécifique

app.get('/api/cave/:id', (req, res) => {
  const zone = zones.find(z => z.id === parseInt(req.params.id));
  zone ? res.json(zone) : res.status(404).send({ error: 'Zone non trouvée' });
});

// GET une zone spécifique
app.get('/api/cave/bottles', (req, res) => {
   //  const totalBottles = zones.reduce((sum, zone) => sum + zone.bottles, 0);

     const bottlesByZone = zones.map(({ name, bottles }) => ({ name, bottles }));
  res.json(bottlesByZone);
 // res.json({ totalBottles });

});

// POST pour ajouter une nouvelle zone
app.post('/api/cave', (req, res) => {
  const newZone = { id: zones.length + 1, ...req.body };
  zones.push(newZone);
  res.status(201).json(newZone);
});

app.listen(port, () => {
  console.log(`Cave backend actif sur http://localhost:${port}/api/cave`);
});

app.get('/api/cave/stats', (req, res) => {
  const totalZones = zones.length;
  const totalBottles = zones.reduce((sum, zone) => sum + zone.bottles, 0);

  res.json({
    totalZones,
    totalBottles
  });
});