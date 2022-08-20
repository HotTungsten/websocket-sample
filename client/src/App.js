import ReactPlayer from 'react-player'
import React from 'react'
import './App.css'
//import Queue from './Components/Queue'
import { io } from 'socket.io-client'
import { useState, useEffect } from 'react'

const socket = io.connect('http://localhost:3001')

const App = () => {

  //video syncing
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

  //video queue 
  const [queue, setQueueItem] = useState([])
  const [urlInput, setUrlInput] = useState('')
  const [currUrl, setCurrUrl] = useState('https://youtu.be/SVi3-PrQ0pY')

  socket.on('update-queue', newQueue => {
    setQueueItem(newQueue)
  })

  socket.on('get-current-queue', () => {
    socket.emit('sync-queue', queue)
  })

  socket.on('update-current-vid', newUrl => {
    setCurrUrl(newUrl)
    if(queue.length > 0) {
      queue.shift()
    }
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

  const playNext = () => {
    if(queue.length > 0) {
      let newVid = queue.shift()
      socket.emit('current-vid', newVid)
      setCurrUrl(newVid)
    }
  }

  //messaging system
  const [chat, setNewChat] = useState([])

  //needed for instance methods. called using ref.current.{methodname}
  const ref = React.createRef()

  return (
    <div class="container">
      {/* Splitting left and right for ease of display. Dont judge me >:( */}
      <div class="left">
        <div class="player">
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
        </div>
        <div class="playlist">
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
              <button>Remove from queue</button>
            </li>)}
          </ul>
        </div>
      </div>
      <div class="right">
        <div class="chat-box">
          
        </div>
        <div class="chat-input">

        </div>
      </div>
    </div>
  );
}

export default App;
