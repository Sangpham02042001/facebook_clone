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

export { showError, showWarning, showSuccess }