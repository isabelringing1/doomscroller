import { useMemo } from 'react'

const CONTENT_HEIGHTS = [3,4 , 5]

export default function Comment() {
  const contentHeight = useMemo(
    () => CONTENT_HEIGHTS[Math.floor(Math.random() * CONTENT_HEIGHTS.length)],
    [],
  )

  return (
    <div className="comment">
      <div className="comment-pfp" aria-hidden="true" />
      <div className="comment-body">
        <div className="comment-username">Comment</div>
        <div
          className="comment-content"
          style={{ height: `${contentHeight}dvh` }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
