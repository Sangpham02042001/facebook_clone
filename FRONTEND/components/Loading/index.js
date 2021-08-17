import React from 'react'
import Image from 'next/image'
import styles from './loading.module.scss'

export default function Loader() {
  return (
    <div className={styles.loadingContainer}>
      <Image src='/images/loading.gif' width={100} height={100} />
    </div>
  )
}
