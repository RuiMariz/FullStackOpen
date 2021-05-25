import axios from 'axios'
const baseUrl = '/api/users'

const getAll = async () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const exports = { getAll }

export default exports