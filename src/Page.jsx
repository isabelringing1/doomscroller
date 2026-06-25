import PageMenu from './PageMenu.jsx'

export default function Page({ index }) {
  return (
    <div className="page">
      <PageMenu index={index} />
    </div>
  )
}
