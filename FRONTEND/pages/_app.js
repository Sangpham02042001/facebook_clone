import 'antd/dist/antd.css'
import '../components/scss/main.scss'
import React, { useState } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import { Provider } from 'react-redux'
import store from '../store'
import useScrollBlock from '../hooks/useScrollBlock'
import Loading from '../components/Loading'

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false)
  const [blockScroll, allowScroll] = useScrollBlock()

  Router.events.on('routeChangeStart', (url) => {
    setLoading(true)
    blockScroll()
  })

  Router.events.on('routeChangeComplete', (url) => {
    setLoading(false)
    allowScroll()
  })

  return (
    <Provider store={store}>
      <Head>
        <link rel="icon" href="/images/facebook.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css"
          integrity="sha512-HK5fgLBL+xu6dm/Ii3z4xhlSUyZgTT9tuc/hSrtw6uzJOvgRr2a9jyxxT1ely+B+xFAmJKVSTbpM/CuL7qxO8w=="
          crossOrigin="anonymous" />
      </Head>
      {loading && <Loading />}
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
