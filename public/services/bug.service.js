const BASE_URL = '/api/bug/'

export const bugService = {
  query,
  getById,
  save,
  remove,
  getEmptyBug,
  getDefaultFilter,
}

function query(
  filterBy = getDefaultFilter(),
  sortBy = { type: 'severity', desc: 1 }
) {
  const filterSortBy = { ...filterBy, ...sortBy }
  return axios.get(BASE_URL, { params: filterSortBy }).then((res) => res.data)
}

function getById(bugId) {
  return axios.get(BASE_URL + bugId).then((res) => res.data)
}

function remove(bugId) {
  return axios.delete(BASE_URL + bugId).then((res) => res.data)
}

function save(bug) {
  const method = bug._id ? 'put' : 'post'
  return axios[method](BASE_URL + 'save', bug).then((res) => res.data)
}

function getEmptyBug(title = '', severity = '', description = '') {
  return { _id: '', title, severity, description, createdAt: Date.now() }
}

function getDefaultFilter() {
  return { title: '', minSeverity: '', labels: '', pageIdx: 0 }
}
