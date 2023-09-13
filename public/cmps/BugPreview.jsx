export function BugPreview({ bug }) {
  return (
    <article className="bug-preview">
      <h4>{bug.title}</h4>
      <h1>🐛</h1>
      <p>
        Owner: <span>{bug.owner.fullname}</span>
      </p>
      <p>
        Severity: <span>{bug.severity}</span>
      </p>
      <p>
        Description: <span>{bug.description}</span>
      </p>
      {/* {bug.labels.map((label) => (
        <p key={label}>{label}</p>
      ))} */}
    </article>
  )
}
