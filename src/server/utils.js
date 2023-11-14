const _ = require('lodash')
function getPage(array, page, perPage) {
  const obj = {}
  const start = (page - 1) * perPage
  const end = page * perPage

  obj.items = array.slice(start, end)
  if (obj.items.length === 0) {
    return obj
  }

  if (page > 1) {
    obj.prev = page - 1
  }

  if (end < array.length) {
    obj.next = page + 1
  }

  if (obj.items.length !== array.length) {
    obj.current = page
    obj.first = 1
    obj.last = Math.ceil(array.length / perPage)
  }

  return obj
}

const isJson = (val) => {
  try {
    JSON.parse(val)
    return true
  } catch (error) {
    return false
  }
}

const adapterConfigFunc = configObject => (val, total) => {
  if(configObject) {
    const resultJson = configObject['res'] || configObject['result'] 
    const result = isJson(resultJson) ? JSON.parse(resultJson) : null
    if(result) {
      if(_.isPlainObject(val)) result.data = val
      if(_.isArray(val)) {
        const listKey = configObject['listKey'] || 'list'
        const totalKey = configObject['totaKey'] || 'total'
        result.data = { [listKey]: val, [totalKey]: total}
      }
      return result
    }
    return val
  }
  return val
}

module.exports = {
  getPage,
  isJson,
  adapterConfigFunc,
}
