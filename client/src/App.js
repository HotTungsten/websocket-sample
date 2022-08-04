import ReactPlayer from 'react-player'
import React from 'react'
import './App.css'
//import Queue from './Components/Queue'
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

  //handles syncing of playing/pausing
  useEffect(() => {
    socket.emit('video-control', playState)
  }, [playState])

  const [queue, setQueueItem] = useState([])
  const [urlInput, setUrlInput] = useState('')
  const [currUrl, setCurrUrl] = useState('https://youtu.be/SVi3-PrQ0pY')

  socket.on('update-queue', newQueue => {
    setQueueItem(newQueue)
  })

  socket.on('update-current-vid', newUrl => {
    setCurrUrl(newUrl)
  })
  
  const addQueueEvent = (url) => {
    if(ReactPlayer.canPlay(url)){
      const updateQueue = [...queue, url]
      setQueueItem(updateQueue)
      setUrlInput('')
      socket.emit('sync-queue', updateQueue)
    }
    else{
      console.log("Error!")
      console.log(url)
    }
  }

  /*
  useEffect(() => {
    socket.emit('sync-queue', queue)
    console.log('e')
  }, [queue])
  */

  const playNext = () => {
    if(queue.length > 0) {
      setCurrUrl(queue.shift())
    }
  }
  
  //needed for instance methods. called using ref.current.{methodname}
  const ref = React.createRef()

  return (
    <div>
      <ReactPlayer
        url={currUrl}
        ref={ref}
        controls={true}
        onPlay={startEvent}
        onPause={pauseEvent}
        onEnded={playNext}
        playing={playState}
        onProgress={e => console.log(e)}
        muted={true}
      />
      <input
        type="url"
        name="url"
        id="url-input"
        placeholder="Enter video url"
        value={urlInput}
        onChange={({target}) => setUrlInput(target.value)}
      />
      <button onClick={() => addQueueEvent(urlInput)}>Add to queue</button>
      <button onClick={playNext}>Skip</button>
      <ul>
        {queue.map(url => <li key={Math.random() * 100}>
          <a href={url} target="_blank">{url}</a>
        </li>)}
      </ul>
    </div>
  );
}

export default App;
