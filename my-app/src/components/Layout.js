import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function Layout() {
  return (
    <div className=''>
       <Header></Header>
       <Outlet></Outlet>
    </div>
  )
}
