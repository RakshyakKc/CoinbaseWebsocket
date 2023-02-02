import React from 'react'

export default function MatchView(props) {
  const matches = props.data.map( (val, index, array) => {
    let color = array[array.length -1 - index].transaction === 'sell' ? 'red':'green'

    return(
      <div className='matchBox'
      style={{backgroundColor:`${color}`}}>
        <div className='matchLeft'>
          <p>{array[array.length -1 - index].id}</p>
          <p>${array[array.length -1 - index].price}</p>
        </div>
        <div className='matchRight'>
          <p>Amount: {array[array.length -1 - index].size}</p>
          <p>{array[array.length -1 - index].time}</p>
          <p>Trade ID: {array[array.length -1 - index].trade_id}</p>
        </div>
      </div>
  )})
  return (
    <div className='matchContainer'>
      <h1>matches</h1>
      {matches}
    </div>
  )
}
