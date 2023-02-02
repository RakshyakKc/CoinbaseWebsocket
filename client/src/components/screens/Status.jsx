import React, { Component } from 'react'
import { w3cwebsocket as W3CWebSocket} from 'websocket'
const client = new W3CWebSocket('ws://127.0.0.1:8080')
export default class Status extends Component {
  constructor(props){
    super(props)
    this.state = {
      l2: [],
      matches: []
    }
  }
  clientIncomingData = () => {
    client.onmessage = (message) => {
        const dataFromServer = JSON.parse(message.data)
        if(dataFromServer.type === 'l2update'){
          let l2Update = {
            id: dataFromServer.product_id,
            time: dataFromServer.time,
            transaction: dataFromServer.changes[0][0],
            price: dataFromServer.changes[0][1]
          }
          if(this.state.l2.length > 200){
            this.setState({l2:[]})
          }
          this.setState(prevState => {
            return {
              ...prevState,
              l2: [...prevState.l2, l2Update]
            }
          })
        }
        else if (dataFromServer.type === 'match'){
          let match = {
            id: dataFromServer.product_id,
            time: dataFromServer.time,
            transaction: dataFromServer.side,
            price: dataFromServer.price,
            size: dataFromServer.size,
            trade_id: dataFromServer.trade_id
          }
          if(this.state.matches.length > 100){
            this.setState({matches:[]})
          }
          this.setState(prevState => {
            return {
              ...prevState,
              matches: [...prevState.matches, match]
            }
          })
        }
    }
  }

  componentDidMount() {
    client.onopen = () => {
      client.send(JSON.stringify({
        type: 'status'
      }))
    }
    this.clientIncomingData()
  }
  render() {
    return (
      <div>Status</div>
    )
  }
}
