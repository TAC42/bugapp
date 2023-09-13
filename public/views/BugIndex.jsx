import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugSort } from '../cmps/BugSort.jsx'

const { useState, useEffect } = React
const { Link } = ReactRouterDOM

export function BugIndex() {
  const [bugs, setBugs] = useState([])
  const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
  const [sort, setSort] = useState({ type: '', desc: 1 })
  const [pageCount, setPageCount] = useState(null)

  useEffect(() => {
    loadBugs()
  }, [filterBy, sort])

  function loadBugs() {
    bugService.query(filterBy, sort).then((data) => {
      setBugs(data.bugsToDisplay)
      setPageCount(data.pageCount)
    })
  }

  function onRemoveBug(bugId) {
    bugService
      .remove(bugId)
      .then(() => {
        const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
        setBugs(bugsToUpdate)
        showSuccessMsg('Bug removed')
      })
      .catch((err) => {
        console.log('Error from onRemoveBug ->', err)
        showErrorMsg('Cannot remove bug')
      })
  }

  function onSetFilter(filterBy) {
    setFilterBy((prevFilterBy) => ({ ...prevFilterBy, ...filterBy }))
  }

  function onChangePageIdx(diff) {
    const nextPageIdx = filterBy.pageIdx + diff
    if (nextPageIdx === pageCount) {
      setFilterBy((prevFilterBy) => ({ ...prevFilterBy, pageIdx: 0 }))
    } else if (nextPageIdx === -1) {
      console.log(filterBy.pageIdx)
      setFilterBy((prevFilterBy) => ({
        ...prevFilterBy,
        pageIdx: pageCount - 1,
      }))
    } else
      setFilterBy((prevFilterBy) => ({ ...prevFilterBy, pageIdx: nextPageIdx }))
  }

  return (
    <main className="bug-index full main-layout">
      <h3>Bugs App</h3>
      <main>
        <BugFilter onSetFilter={onSetFilter} filterBy={filterBy} />
        <button>
          <Link to="/bug/edit">Add Bug ⛐</Link>
        </button>
        <BugSort sort={sort} setSort={setSort} />
        <BugList
          bugs={bugs}
          onRemoveBug={onRemoveBug}
          sort={sort}
          setSort={setSort}
        />
        <section>
          <button onClick={() => onChangePageIdx(-1)}>Prev</button>
          <span>{filterBy.pageIdx + 1}</span>
          <button onClick={() => onChangePageIdx(1)}>Next</button>
        </section>
      </main>
    </main>
  )
}
