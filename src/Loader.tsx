import ClipLoader from 'react-spinners/ClipLoader'

interface PropsType {}

const Loader = (props: PropsType) => {
  return (
    <div className='screen-overlay'>
      <ClipLoader
        speedMultiplier={0.5}
        size={60}
        color='#ff0099'
      />
    </div>
  )
}

export default Loader
