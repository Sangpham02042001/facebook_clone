
const signout = (cb) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user')
  }
  cb()
}

export {
  signout
}