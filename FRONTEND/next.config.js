module.exports = {
  async redirects() {
    return [
      {
        source: '/groups',
        destination: '/groups/feeds',
        permanent: false,
      },
    ]
  },
}