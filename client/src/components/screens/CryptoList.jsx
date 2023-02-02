import React from 'react'

export function CryptoList(props) {
    
  return (
    <div className="cryptoWrapper">
        <div className='cryptoBox'>
            {<button value="ETH-USD" onClick={(e) => props.handleClick(e)}>ETH</button>}
        </div>
        <div className='cryptoBox'>
            <button value="BTC-USD" onClick={(e) => props.handleClick(e)}>BTC</button>
        </div>
        <div className='cryptoBox'>
            <button value="DOGE-USD" onClick={(e) => props.handleClick(e)}>DOGE</button>
        </div>
        <div className='cryptoBox'>
            <button value="LTC-USD" onClick={(e) => props.handleClick(e)}>LTC</button>
        </div>
    </div>
  )
}
