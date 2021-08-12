import React from 'react'
import Head from 'next/head'
import Header from '../header'

export default function Layout(props) {
  return (
    <div>
      <Head>
        <link rel="icon" href="/images/facebook.ico" />
      </Head>
      <Header />
      <div style={{ marginTop: '66px' }}>
        {props.children}
      </div>
    </div>
  )
}
