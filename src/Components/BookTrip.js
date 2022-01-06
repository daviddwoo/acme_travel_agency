import React from 'react';
import { connect } from 'react-redux';
import { addTrip, updateTrip } from '../store';
import { Link } from 'react-router-dom'

class BookTrip extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      clients: this.props.clients.length ? this.props.clients : [],
      places: this.props.places.length ? this.props.places : [],
      trips: this.props.trips.length ? this.props.trips : [],
      purposes: ['business', 'pleasure', 'other'],
      bookTrip: {
        clientId: '',
        placeId: '',
        date: '',
        purpose: ''
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.clients.length && this.props.clients.length) {
      this.setState({...this.state, clients: this.props.clients})
    }
    if (!prevProps.places.length && this.props.places.length) {
      this.setState({...this.state, places: this.props.places})
    }
    if (!prevProps.trips.length && this.props.trips.length) {
      this.setState({...this.state, trips: this.props.trips})
    }
  }

  onChange = (ev) => {
    this.setState({
      ...this.state,
      bookTrip: {
        ...this.state.bookTrip,
        [ev.target.name]: (ev.target.name === 'clientId' || ev.target.name === 'placeId') ? ev.target.value * 1 : ev.target.value
      }
    });
  }

  onSubmit = async(ev) => {
    ev.preventDefault();
    try {
      await this.props.addTrip(this.state.bookTrip);
      this.setState({...this.state, trips: [...this.props.trips]})
    }
    catch(ex) {
      console.log(ex);
    }
  }

  daysAway = (date) => {
    const currentDate = new Date();
    const vacationDate = new Date(date);
    const difference = vacationDate.getTime() - currentDate.getTime();
    const daysAway = Math.ceil(difference / (1000 * 3600 * 24));
    return daysAway
  }

  delayBy = async(numOfDays, trip) => {
    try {
      const vacationDate = new Date(trip.date);
      vacationDate.setDate(vacationDate.getDate() + numOfDays);
      await this.props.updateTrip({...trip, date: vacationDate});
      this.setState({...this.state, trips: [...this.props.trips]});
    }
    catch(ex) {
      console.log(ex)
    }
  }

  render() {
    const { clients, places, trips, purposes, bookTrip } = this.state;
    return (
      <div className='bt'>
          <div className='bt-header'>
            <h1>Book Your Client's Trip Now!</h1>
            <div className='bt-header-border'></div>
            <h2>Total Trip Count: {trips.length}</h2>
          </div>
        <div className='bt-form'>
          <div className='bt-left'>
            <div className='bt-form-out-wrapper'>
              <div className='bt-header-wrapper'>
                <h1>Book Here!</h1>
              </div>
              <form onSubmit={this.onSubmit}>
                <div className='bt-form-wrapper'>
                  <div className='bt-form-select'>
                    <select className='bt-select' name='clientId' onChange={this.onChange}>
                    <option value='none'>Select a client!</option>
                      {
                        clients.map((client) => { 
                          return (
                            <option key={client.id} value={client.id}>
                              {client.name}
                            </option>
                          )
                        })
                      }
                    </select>
                    {
                      bookTrip.clientId ? <Link to={`/clients/${bookTrip.clientId}`}><h3>Go to Client's Trip</h3> </Link>: null
                    }
                  </div>
                  <div className='bt-form-select'>
                    <select className='bt-select' name='placeId' onChange={this.onChange}>
                    <option value='none'>Select a destination!</option>
                      {
                        places.map((place) => {
                          return (
                            <option key={place.id} value={place.id}>
                              {place.name}
                            </option>
                          )
                        })
                      }
                    </select>
                  </div>
                  <div className='bt-form-select'>
                    <input className='bt-date' name='date' type='date' min={new Date().toISOString().split('T')[0]} onChange={this.onChange} placeholder='Enter a date'/>
                  </div>
                  <div className='bt-form-select'>
                    <select className='bt-select' name='purpose' onChange={this.onChange}>
                      <option value='none'>Choose Your Trip Purpose</option>
                      {
                        purposes.map((purpose, idx) => {
                          return (
                            <option key={idx}>
                              {purpose}
                            </option>
                          )
                        })
                      }
                    </select>
                  </div>
                  <div className='bt-form-select'>
                    <button className='bt-button-submit' type='submit'>Book Trip</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className='bt-right'>
            <div className='bt-right-wrapper'>
              <div className='bt-right-table-wrapper'>
                <table className='bt-latest-trips'>
                  <tbody>
                    <tr>
                      <th>Name</th>
                      <th>Destination</th>
                      <th>Time Until Trip</th>
                      <th>Delay</th>
                    </tr>
                  </tbody>
                  {
                    trips.filter((trip) => {
                      if (this.daysAway(trip.date) < 7) return trip
                    })
                      .map((trip) => {
                        const client = clients.find((client) => client.id === trip.clientId);
                        const place = places.find((place) => place.id === trip.placeId);
                        const daysUntil = this.daysAway(trip.date);
                        return (
                          <tbody key={trip.id} className='bt-tbody'>
                            <tr>
                              <td>{client.name}</td>
                              <td>{place.name}</td>
                              <td>
                                {daysUntil > 1 ? daysUntil + ' days' : daysUntil + ' day'}
                              </td>
                              <td id='bt-delay-td'>
                                <button className='bt-delay-button' onClick={() => this.delayBy(1, trip)}>DELAY</button>
                              </td>
                            </tr>
                          </tbody>
                          // <div key={trip.id}>
                          //   <h1>{client.name} is going to {place.name} in {daysUntil > 1 ? daysUntil + ' days' : daysUntil + ' day'}</h1>
                          //   <button onClick={() => this.delayBy(1, trip)}>DELAY</button>
                          // </div>
                        )
                      })
                  }

                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({clients, places, trips}) => {
  return {
    clients,
    places,
    trips
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    addTrip: (trip) => dispatch(addTrip(trip)),
    updateTrip: (trip) => dispatch(updateTrip(trip))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookTrip)