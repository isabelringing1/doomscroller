export default function ShareComponent({ highlighted, onClick }) {
  return (
    <button
      type="button"
      className="share-component"
      onClick={onClick}
      disabled={!onClick}
    >
      {highlighted && <div className="share-component-icon--highlight"></div>}
      <div
        className="share-component-icon"
        aria-hidden="true"
      />
      <div className="share-component-label" aria-hidden="true" />
    </button>
  )
}
