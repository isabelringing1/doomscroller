import PageMenu from './PageMenu.jsx'
import PageDuration from './PageDuration.jsx'

export default function Page({ index, active }) {
  return (
    <div className="page" data-active={active || undefined}>
      <PageMenu index={index} />
      <PageDuration index={index} active={active} />
    </div>
  )
}
