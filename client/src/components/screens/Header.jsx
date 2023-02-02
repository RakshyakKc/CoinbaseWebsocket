import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <div className='header'>
        <NavLink className='main-bar' to='/'>Cryptos</NavLink>
        <NavLink className='main-bar' to='/priceview'>Price</NavLink>
        <NavLink className='main-bar' to='/matchview'>Match</NavLink>
        <NavLink className='main-bar' to='/status'>Status</NavLink>
    </div>
  )
}
