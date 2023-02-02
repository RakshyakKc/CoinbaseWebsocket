import React, { Component } from 'react'
import { Routes, Route } from 'react-router-dom'
import PriceView from './screens/PriceView'
import Status from './screens/Status'
import { w3cwebsocket as W3CWebSocket} from 'websocket'
import Header from './screens/Header'
import { CryptoList } from './screens/CryptoList'
import MatchView from './screens/MatchView'

const client = new W3CWebSocket('ws://127.0.0.1:8080')

export default class Container extends Component {
  constructor(props){
    super(props)
    this.state = {
      subscriptions: [],
      l2: [],
      matches: []
    }
  }
    //handles subscribing and unsubscribing to coins
    handleClick = (event) => {
      //subscribe if not already
      if(!this.state.subscriptions.includes(event.currentTarget.value)){
        let newSubscriptions = [...this.state.subscriptions, event.currentTarget.value]
        this.setState({subscriptions:newSubscriptions})

        client.send(JSON.stringify({
          type: 'subscribe',
          product_id: event.currentTarget.value,
          channels: ['level2','matches']
        }))
      }
      //unsub if subbed
      else if(this.state.subscriptions.includes(event.currentTarget.value)){
        let newSubscription = [this.state.subscriptions.splice(this.state.subscriptions.indexOf(event.currentTarget.value))]
        this.setState({subscriptions:newSubscription})
        client.send(JSON.stringify({
          type: 'unsubscribe',
          product_id: event.currentTarget.value,
          channels: ['level2','matches']
        }))
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
        console.log('client connected')
      };
      this.clientIncomingData()
    }


  render() {
    return (
      <div className='container'>
        <Header />
        <Routes>
          <Route
              path="/"
              element={<CryptoList handleClick={this.handleClick} subscriptions={this.state.subscriptions} />}
          />
          <Route 
              path="/matchview"
              element={<MatchView data={this.state.matches}/>}
          />
          <Route 
              exact
              path="/priceview"
              element={ <PriceView data={this.state.l2}/>}
          />
          <Route 
              exact
              path="/status"
              element={ <Status />}
          />
    </Routes>
      </div>
    )
  }
}
