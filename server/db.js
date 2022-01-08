const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_travel_agency');
const { STRING, DATE } = Sequelize

const Client = conn.define('client', {
  name: {
    type: STRING
  }
});

const Place = conn.define('place', {
  name: {
    type: STRING
  } 
});

const Trip = conn.define('trip', {
  date: {
    type: DATE
  },
  purpose: {
    type: STRING 
  } 
});     
 
Client.hasMany(Trip);
Trip.belongsTo(Client);
Trip.belongsTo(Place);
 
const data = {
  clients: ['Moe', 'Lucy', 'Larry', 'Ethyl'],
  places: ['Antartica', 'Fiji', 'Madagascar', 'Ohio']
};

const syncAndSeed = async() => {
  try {
    await conn.sync({force: true});
    const [moe, lucy, larry, ethyl] = await Promise.all(data.clients.map((name) => Client.create({name})));
    const [ant, fiji, mada, ohio] = await Promise.all(data.places.map((name) => Place.create({name})));
  }
  catch(ex) {
    console.log(ex);
  }
}; 

module.exports = {
  models: {
    Client,
    Place,
    Trip  
  },  
  syncAndSeed
}