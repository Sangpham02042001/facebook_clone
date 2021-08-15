import React from 'react'
import { Upload, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'

const { Dragger } = Upload

export default function UploadImage(props) {
  const myProps = {
    name: props.name,
    multiple: props.multiple,
    onChange(info) {
      const { status } = info.file
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
        if (props.multiple) {
          props.onUploadSuccess && props.onUploadSuccess(info.fileList)
        } else {
          props.onUploadSuccess && props.onUploadSuccess(info.file)
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }
  return (
    <Dragger {...myProps} accept="image/*">
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag file to this area to upload</p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibit from uploading company data or other
        band files
      </p>
    </Dragger>
  )
}
