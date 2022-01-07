import React from 'react'
import BookTrip from './Components/BookTrip'
import ClientTrips from './Components/ClientTrips'
import FrontPage from './Components/FrontPage'
import { connect } from 'react-redux'
import { loadClients, loadPlaces, loadTrips } from './store'
import { HashRouter as Router, Route, Switch} from 'react-router-dom'
// import Routes from './Components/Routes'


class App extends React.Component {

  componentDidMount() {
    this.props.loadClients();
    this.props.loadPlaces();
    this.props.loadTrips();
  }

  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path='/home' component={FrontPage}/>
            <Route path='/booktrips' component={BookTrip}/>
            <Route path='/clients/:id' component={ClientTrips} />
          </Switch>
        </div>
      </Router>
    )
  }
};

const mapStateToProps = ({ clients, places, trips }) => {
  return {
    clients,
    places,
    trips
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadClients: () => dispatch(loadClients()),
    loadPlaces: () => dispatch(loadPlaces()),
    loadTrips: () => dispatch(loadTrips()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)