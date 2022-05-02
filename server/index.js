const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { models: {Client, Trip, Place}, syncAndSeed } = require('./db')

app.use('/dist', express.static(path.join(__dirname, '..', 'dist')));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());
app.use(cors());

app.get('/', (req, res)=> res.sendFile(path.join(__dirname, '..', 'src', 'index.html')));

app.get('/api/clients', async(req, res, next) => {
  try {
    res.send(await Client.findAll())
  }
  catch(ex) {
    next(ex);
  }
});

app.get('/api/places', async(req, res, next) => {
  try {
    res.send(await Place.findAll())
  }
  catch(ex) {
    next(ex);
  }
});

app.get('/api/trips', async(req, res, next) => {
  try {
    res.send(await Trip.findAll({
      include: [Client, Place]
    }))
  } 
  catch(ex) {
    next(ex);
  }
});

app.post('/api/trips', async(req, res, next) => {
  try {
    res.send(await Trip.create(req.body));
  }
  catch(ex) {
    next(ex);
  }
});

app.put('/api/trips/:id', async(req, res, next) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    res.send(await trip.update(req.body));
  }
  catch(ex) {
    next(ex);
  }
});

app.delete('/api/trips/:id', async(req, res, next) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    await trip.destroy();
    res.sendStatus(204);
  }
  catch(ex) {
    next(ex);
  }
});

const init = async() => {
  try {
    await syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
  }
  catch(ex) {
    console.log(ex);
  }
};

init();
