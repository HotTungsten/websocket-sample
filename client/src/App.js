import ReactPlayer from 'react-player'
import React from 'react'
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

  const bufferEvent = () => {
    console.log("Video buffer!")
  }

  //needed for instance methods. called using ref.current.{methodname}
  const ref = React.createRef()
  
  useEffect(() => {
    socket.emit('video-control', playState)
  }, [playState])

  return (
    <div>
      <ReactPlayer
        url='https://youtu.be/rb13bEEwv20'
        ref={ref}
        controls={true}
        onPlay={startEvent}
        onPause={pauseEvent}
        onBuffer={bufferEvent}
        playing={playState}
        muted={true}
      />
      <button onClick={() => console.log(ref.current.getCurrentTime())}>The seeker</button>
    </div>
  );
}

export default App;
