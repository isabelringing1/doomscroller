import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { Bookmark, Heart, MessageCircle, Share2 } from 'lucide-react'
import { generateCaption } from './Util.js'
import { playerAction } from './store.js'

export default function PageMenu({ index, active }) {
  const dispatch = useDispatch()
  const name = `@user_${index}`
  const caption = useMemo(() => generateCaption(), [index])

  const onButton = (name) => {
    if (!active) return
    dispatch(playerAction({ type: 'button', name }))
  }

  return (
    <>
      <div className="page-info">
        <div className="page-name">{name}</div>
        <div className="page-caption">{caption}</div>
      </div>
      <div className="page-actions">
        <button type="button" aria-label="Like" onClick={() => onButton('like')}><Heart size={28} /></button>
        <button type="button" aria-label="Comment" onClick={() => onButton('comment')}><MessageCircle size={28} /></button>
        <button type="button" aria-label="Save" onClick={() => onButton('save')}><Bookmark size={28} /></button>
        <button type="button" aria-label="Share" onClick={() => onButton('share')}><Share2 size={28} /></button>
      </div>
    </>
  )
}
