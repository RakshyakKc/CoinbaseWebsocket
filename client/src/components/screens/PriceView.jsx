import React from 'react'

export default function PriceView(props) {
  console.log(props.data)
  const prices = props.data.map((val, index, array) => {
    let color = array[array.length -1 - index].transaction === 'sell' ? 'red':'green'
    return (
      <div 
      className='priceBox' 
      style={{backgroundColor:`${color}`}}>

        <p>{array[array.length -1 - index].id}</p>
        <p>{array[array.length -1 - index].price}</p>
        <p>{array[array.length -1 - index].time}</p>

      </div>
    )
  })
  return (
    <div className='priceContainer'>
      <div className='priceBox'>
        <p>Coin Name</p>
        <p className='price'>Price</p>
        <p>Time</p>
      </div>
      {prices}
    </div>
  )
}
