import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/404.module.scss'

export default function FourOhFour() {
  return (
    <>
      <Head>
        <title>Page not found</title>
      </Head>
      <div className={styles.fofContainer}>
        <h1>404</h1>
        <p>Ooops Page not found</p>
        <Link href='/'>Go to home page</Link>
      </div>
    </>
  )
}
