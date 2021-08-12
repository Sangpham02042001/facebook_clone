import React from 'react'
import Head from 'next/head'
import NavBar from '../NavBar'

export default function Layout(props) {
  return (
    <div>
      <Head>
        <link rel="icon" href="/images/facebook.ico" />
      </Head>
      <NavBar />
      <div style={{ marginTop: '66px' }}>
        {props.children}
      </div>
    </div>
  )
}
