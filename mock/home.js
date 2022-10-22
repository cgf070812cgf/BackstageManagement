const data = require('./data.json')
module.exports = [
  {
    url: '/home/list',
    type: 'get',
    response: () => {
      return {
        code: 200,
        data
      }
    }
  }
]
