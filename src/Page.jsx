import PageMenu from './PageMenu.jsx'

export default function Page({ index, active }) {
  return (
    <div className="page" data-active={active || undefined}>
      <PageMenu index={index} />
    </div>
  )
}
