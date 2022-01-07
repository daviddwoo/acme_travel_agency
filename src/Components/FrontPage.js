import React from 'react'
import Travel from '../../public/trav.png'

const FrontPage = () => {
  return (
    <div className='fp'>
      <div className='fp-left'>
        <div className='fp-left-wrapper'>
          <div className='fp-title'>
            <h3>Welcome to the</h3>
            <h1>Acme Travel Agency</h1>
            <h2>Begin your journey with us! Book your trip now!</h2>
            <button className='btn btn2'>
              Book Your Next Trip 
            </button>
          </div>
        </div>
      </div>
      <div className='fp-right'>
        <div className='fp-right-wrapper'>
          <div className='fp-image'>
            <img className='fp-img' src={Travel} alt='' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FrontPage