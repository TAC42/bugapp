import fs from 'fs'
import { utilService } from './util.service.js'
let gBugs = utilService.readJsonFile('data/bug.json')
const PAGE_SIZE = 3

export const bugService = {
  query,
  get,
  remove,
  save,
}
function query(filterBy = {}, sortBy) {
  let bugsToDisplay = gBugs
  if (filterBy.title) {
    const regExp = new RegExp(filterBy.title, 'i')
    bugsToDisplay = bugsToDisplay.filter(
      (bug) => regExp.test(bug.title) || regExp.test(bug.description)
    )
  }
  if (filterBy.minSeverity) {
    bugsToDisplay = bugsToDisplay.filter(
      (bug) => bug.severity >= filterBy.minSeverity
    )
  }
  if (filterBy.labels) {
    const labelsToFilter = filterBy.labels
    bugsToDisplay = bugsToDisplay.filter((bug) =>
      labelsToFilter.every((label) => bug.labels.includes(label))
    )
    // ['famous', 'low']
  }

  // 14 / 3 = 4.6 => 5
  const pageCount = Math.ceil(bugsToDisplay.length / PAGE_SIZE)

  bugsToDisplay = getSortedBugs(bugsToDisplay, sortBy)

  if (filterBy.pageIdx !== undefined) {
    let startIdx = filterBy.pageIdx * PAGE_SIZE
    bugsToDisplay = bugsToDisplay.slice(startIdx, startIdx + PAGE_SIZE)
  }

  const data = { bugsToDisplay, pageCount }
  return Promise.resolve(data)
}

function get(bugId) {
  const bug = gBugs.find((bug) => bug._id === bugId)
  if (!bug) return Promise.reject('bug not found!')
  return Promise.resolve(bug)
}

function remove(bugId, loggedinUser) {
  const idx = gBugs.findIndex((bug) => bug._id === bugId)
  if (idx === -1) return Promise.reject('No Such Bug')
  const bug = gBugs[idx]
  if (!loggedinUser.isAdmin && bug.owner._id !== loggedinUser._id) {
    return Promise.reject('Not your car')
  }
  gBugs = gBugs.filter((bug) => bug._id !== bugId)
  return _saveBugsToFile()
}

function save(bug, loggedinUser) {
  if (bug._id) {
    const bugToUpdate = gBugs.find((currBug) => currBug._id === bug._id)
    if (!loggedinUser.isAdmin && bugToUpdate.owner._id !== loggedinUser._id)
      return Promise.reject('Not your Bug')
    bugToUpdate.title = bug.title
    bugToUpdate.severity = bug.severity
    bugToUpdate.description = bug.description
    bugToUpdate.labels = bug.labels
  } else {
    bug._id = utilService.makeId()
    bug.owner = loggedinUser
    gBugs.push(bug)
  }

  return _saveBugsToFile().then(() => bug)
}

function getSortedBugs(bugsToDisplay, sortBy) {
  bugsToDisplay.sort(
    (b1, b2) => sortBy.desc * (b2[sortBy.type] - b1[sortBy.type])
  )
  return bugsToDisplay
}

function _saveBugsToFile() {
  return new Promise((resolve, reject) => {
    const bugsStr = JSON.stringify(gBugs, null, 2)
    fs.writeFile('data/bug.json', bugsStr, (err) => {
      if (err) {
        return console.log(err)
      }
      console.log('The file was saved!')
      resolve()
    })
  })
}
