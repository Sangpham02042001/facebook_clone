import { message } from 'antd'

const showError = (err) => {
  message.error(err)
}

const showWarning = (warning) => {
  message.warning(warning)
}

const showSuccess = (mess) => {
  message.success(mess)
}

const getTimeDiff = (t) => {
  let time = Math.floor((Date.now() - new Date(t)) / 1000)
  if (time > 311040000)
    return `${Math.floor(time / 311040000)} years ago`
  if (time > 25920000)
    return `${Math.floor(time / 25920000)} months ago`
  if (time > 86400)
    return `${Math.floor(time / 86400)} days ago`
  if (time > 3600)
    return `${Math.floor(time / 3600)} hours ago`
  if (time > 60)
    return `${Math.floor(time / 60)} minutes ago`
  return `${time} seconds ago`
}

export { showError, showWarning, showSuccess, getTimeDiff }