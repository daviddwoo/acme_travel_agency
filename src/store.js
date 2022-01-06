import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';

//---------------ACTION CREATORS---------------//

const _loadClients = (clients) => {
  return {
    type: 'LOAD_CLIENTS',
    clients
  }
};

const _loadPlaces = (places) => {
  return {
    type: 'LOAD_PLACES',
    places
  }
};

const _loadTrips = (trips) => {
  return {
    type: 'LOAD_TRIPS',
    trips
  }
};

const _updateTrip = (trip) => {
  return {
    type: 'UPDATE_TRIP',
    trip
  }
};

const _deleteTrip = (tripId) => {
  return {
    type: 'DELETE_TRIP',
    tripId
  }
};

const _addTrip = (trip) => {
  return {
    type: 'ADD_TRIP',
    trip
  }
};

//---------------THUNKS---------------//

export const loadClients = () => {
  return async(dispatch) => {
    const clients = (await axios.get('/api/clients')).data;
    dispatch(_loadClients(clients));
  }
};

export const loadPlaces = () => {
  return async(dispatch) => {
    const places = (await axios.get('/api/places')).data;
    dispatch(_loadPlaces(places));
  }
};

export const loadTrips = () => {
  return async(dispatch) => {
    const trips = (await axios.get('/api/trips')).data;
    dispatch(_loadTrips(trips));
  }
};

export const updateTrip = (trip) => {
  return async(dispatch) => {
    trip = (await axios.put(`/api/trips/${trip.id}`, trip)).data;
    dispatch(_updateTrip(trip));
  }
};

export const deleteTrip = (tripId) => {
  return async(dispatch) => {
    await axios.delete(`/api/trips/${tripId}`)
    dispatch(_deleteTrip(tripId));
  }
};

export const addTrip = (trip) => {
  return async(dispatch) => {
    const newTrip = (await axios.post('/api/trips', trip)).data;
    dispatch(_addTrip(newTrip));
  }
};


//---------------CombineReducers---------------//

const clientReducer = (state = [], action) => {
  switch (action.type) {
    case 'LOAD_CLIENTS':
      return action.clients
    default:
      return state
  } 
};

const placeReducer = (state = [], action) => {
  switch (action.type) {
    case 'LOAD_PLACES':
      return action.places
    default:
      return state
  }
};

const tripReducer = (state = [], action) => {
  switch (action.type) {
    case 'LOAD_TRIPS':
      return action.trips
    case 'UPDATE_TRIP':
      return state.map((trip) => trip.id === action.trip.id ? action.trip : trip)
    case 'DELETE_TRIP':
      return state.filter((trip) => trip.id !== action.tripId)
    case 'ADD_TRIP':
      return [...state, action.trip]
    default: 
      return state
  }
};

const reducer = combineReducers({
  clients: clientReducer,
  places: placeReducer,
  trips: tripReducer
});

const store = createStore(reducer, applyMiddleware(thunk));

export default store