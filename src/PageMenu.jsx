import { useDispatch } from 'react-redux'
import { Bookmark, Heart, MessageCircle, Share2 } from 'lucide-react'
import { playerAction } from './store.js'

const CAPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
]

export default function PageMenu({ index, active }) {
  const dispatch = useDispatch()
  const captionIdx = ((index % CAPTIONS.length) + CAPTIONS.length) % CAPTIONS.length
  const name = `@user_${index}`
  const caption = CAPTIONS[captionIdx]

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
