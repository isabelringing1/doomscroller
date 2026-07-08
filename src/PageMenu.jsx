import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Bookmark, Heart, MessageCircle } from 'lucide-react'
import share from '/share.png'
import { generateCaption } from './Util.js'
import { playerAction, togglePageEngagement, openComments } from './store.js'

export default function PageMenu({ index, active }) {
  const dispatch = useDispatch()
  const liked = useSelector((s) => s.game.pageEngagement[index]?.liked ?? false)
  const saved = useSelector((s) => s.game.pageEngagement[index]?.saved ?? false)
  const speedUpHeld = useSelector((s) => s.game.speedUpHeld)
  const feedGeneration = useSelector((s) => s.feed.feedGeneration)
  const name = `@user_${index}`
  const caption = useMemo(() => generateCaption(), [index, feedGeneration])

  const onButton = (name) => {
    if (!active) return
    dispatch(playerAction({ type: 'button', name }))
    if (name === 'like' || name === 'save') {
      dispatch(togglePageEngagement({ pageIndex: index, name }))
    }
    if (name === 'comment') {
      dispatch(openComments())//{ topBlueText: 'what is special 4th of july cheese' }
    }
  }

  const chromeHidden = active && speedUpHeld

  return (
    <>
      <div className={`page-info${chromeHidden ? ' page-info--hidden' : ''}`}>
        <div className="page-name">{name}</div>
        <div className="page-caption">
          <span className="page-caption-text">
            {caption.phrase}
            {caption.hashtags.map((tag, i) => (
              <span key={`${tag}-${i}`} className="page-caption-hashtag"> #{tag}</span>
            ))}
          </span>
        </div>
      </div>
      <div className={`page-actions${chromeHidden ? ' page-actions--hidden' : ''}`}>
        <button
          type="button"
          className={`page-action${liked ? ' page-action--liked' : ''}`}
          aria-label="Like"
          onClick={() => onButton('like')}
        >
          <Heart size={28} />
        </button>
        <button type="button" className="page-action" aria-label="Comment" onClick={() => onButton('comment')}>
          <MessageCircle size={28} />
        </button>
        <button
          type="button"
          className={`page-action${saved ? ' page-action--saved' : ''}`}
          aria-label="Save"
          onClick={() => onButton('save')}
        >
          <Bookmark size={28} />
        </button>
        <button type="button" aria-label="Share" onClick={() => onButton('share')}>
          <img src={share} alt="" width={28} height={28} />
        </button>
      </div>
    </>
  )
}
