import React from 'react'
import { connect } from 'react-redux'
import { updateTrip, deleteTrip } from '../store'

class ClientTrips extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      clientTrips: this.props.clientTrips.length ? this.props.clientTrips : [],
      client: this.props.client ? this.props.client : {}
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.clientTrips.length && this.props.clientTrips.length) {
      this.setState({...this.state, clientTrips: [...this.props.clientTrips]})
    }
    if (!prevProps.client && this.props.client) {
      this.setState({...this.state, client: this.props.client})
    }
  }

  delayBy = async(numOfDays, trip) => {
    try {
      const vacationDate = new Date(trip.date);
      vacationDate.setDate(vacationDate.getDate() + numOfDays);
      await this.props.updateTrip({...trip, date: vacationDate});
      this.setState({...this.state, clientTrips: [...this.props.clientTrips]});
    }
    catch(ex) {
      console.log(ex)
    }
  };

  deleteClientTrip = async(tripId) => {
    try {
      await this.props.deleteTrip(tripId);
      this.setState({...this.state, clientTrips: this.state.clientTrips.filter((clientTrip) => clientTrip.id !== tripId)});
    }
    catch(ex) {
      console.log(ex);
    }
  };

  displayDate = (date) => {
    const newDate = new Date(date);
    const days = String(newDate.getDate()).padStart(2, '0');
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const year = newDate.getFullYear();
    return month + '/' + days + '/' + year
  }

  render() {
    const { client, clientTrips } = this.state;
    return(
      <div className='ct'>
        <div className='ct-left'>
          <div className='ct-left-wrapper'>
            <div className='ct-client-trips'>
              <h1>{client.name}'s Trips!</h1>
              <table className='ct-trips'>
                <tbody>
                  <tr>
                    <th>Destination</th>
                    <th>Date of Trip</th>
                    <th>Trip Purpose</th>
                    <th>Delay by 1 Week</th>
                    <th>Cancel Trip</th>
                  </tr>
                </tbody>
                {
                  clientTrips.map((trip) => {
                    const place = this.props.places.find((place) => place.id === trip.placeId);
                    return (
                      <tbody key={trip.id} className='bt-tbody'>
                        <tr>
                          <td>{place.name}</td>
                          <td>{this.displayDate(trip.date)}</td>
                          <td>{trip.purpose}</td>
                          <td id='bt-delay-td'>
                            <button className='bt-delay-button' onClick={() => this.delayBy(7, trip)}>DELAY BY 1 WEEK</button>
                          </td>
                          <td id='bt-delay-td'>
                            <button className='bt-delay-button' onClick={() => this.deleteClientTrip(trip.id)}> X </button>
                          </td>
                        </tr>
                      </tbody>
                    )
                  })
                }
              </table>
            </div>
          </div>
        </div>
        <div className='ct-right'>
          <div className='ct-right-bg'></div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ clients, places, trips }, { match }) => {
  const client = clients.find((client) => client.id === match.params.id * 1);
  const clientTrips = trips.filter((trip) => trip.clientId === match.params.id * 1);
  return {
    client,
    clientTrips,
    places
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateTrip: (trip) => dispatch(updateTrip(trip)),
    deleteTrip: (trip) => dispatch(deleteTrip(trip))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientTrips)