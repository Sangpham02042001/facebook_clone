const isAuthenticate = () => {
  if (typeof window == 'undefined') {
    return false;
  }
  if (localStorage.getItem('user')) {
    return JSON.parse(localStorage.getItem('user'))
  }
  return false;
}

const signout = (cb) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user')
  }
  cb()
}

export {
  isAuthenticate, signout
}