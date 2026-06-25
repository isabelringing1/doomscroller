import { Bookmark, Heart, MessageCircle, Share2 } from 'lucide-react'

const CAPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
]

export default function PageMenu({ index }) {
  const captionIdx = ((index % CAPTIONS.length) + CAPTIONS.length) % CAPTIONS.length
  const name = `@user_${index}`
  const caption = CAPTIONS[captionIdx]

  return (
    <>
      <div className="page-info">
        <div className="page-name">{name}</div>
        <div className="page-caption">{caption}</div>
      </div>
      <div className="page-actions">
        <button type="button" aria-label="Like"><Heart size={28} /></button>
        <button type="button" aria-label="Comment"><MessageCircle size={28} /></button>
        <button type="button" aria-label="Save"><Bookmark size={28} /></button>
        <button type="button" aria-label="Share"><Share2 size={28} /></button>
      </div>
    </>
  )
}
