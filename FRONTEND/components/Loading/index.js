import React from 'react'
import Image from 'next/image'
import styles from './loading.module.scss'

export default function Loading(props) {
  let width = props.width;
  let height = props.height
  if (!props.width) width = 100;
  if (!props.height) height = 100;
  return (
    <div className={styles.loadingContainer}>
      <Image src='/images/loading.gif' width={100} height={100} />
    </div>
  )
}
