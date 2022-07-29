import ReactPlayer from 'react-player'
import { io } from 'socket.io-client'
import { useState, useEffect } from 'react'

const socket = io.connect('http://localhost:3001')

const App = () => {
  const [playState, setPlayState] = useState(false)

  socket.on('video-state', playState => {
    setPlayState(playState)
  })

  const startEvent = () => {
    console.log("Video started!")
    setPlayState(true)
  }

  const pauseEvent = () => {
    console.log("Video paused!")
    setPlayState(false)
  }

  const seekEvent = () => {
    console.log("Seeking!")
  }

  useEffect(() => {
    socket.emit('video-control', playState)
  }, [playState])


  return (
    <div>
      <ReactPlayer
        url='https://youtu.be/rb13bEEwv20'
        controls={true}
        onPlay={startEvent}
        onPause={pauseEvent}
        onSeek={seekEvent}
        playing={playState}
        muted={true}
      />
    </div>
  );
}

export default App;
