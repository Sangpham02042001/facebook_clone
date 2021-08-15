import React from 'react'
import Image from 'next/image'
import styles from './loading.module.scss'

export default function Loader() {
  return (
    <div className={styles.loadingContainer}>
      <Image src='/images/loading.gif' width={200} height={200} />
    </div>
  )
}
