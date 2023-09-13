const { Link } = ReactRouterDOM
import { userService } from '../services/user.service.js'
import { BugPreview } from './BugPreview.jsx'

export function BugList({ bugs, onRemoveBug }) {
  const user = userService.getLoggedinUser()

  function isOwner(bug) {
    if (!user) return false
    return user.isAdmin || bug.owner._id === user._id
  }

  return (
    <section className="bug-list">
      <ul className="bug-list">
        {bugs.map((bug) => (
          <li key={bug._id}>
            <BugPreview bug={bug} />
            <section>
              <button>
                <Link to={`/bug/${bug._id}`}>Details</Link>
              </button>
              {isOwner(bug) && (
                <div>
                  <button>
                    <Link to={`/bug/edit/${bug._id}`}>Edit</Link>
                  </button>
                  <button
                    onClick={() => {
                      onRemoveBug(bug._id)
                    }}
                  >
                    x
                  </button>
                </div>
              )}
            </section>
          </li>
        ))}
      </ul>
    </section>
  )
}
