import { useState } from 'react'
import ReactPlayer from 'react-player'
import React from 'react'

const Queue = ({socket}) => {
    
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
        setCurrUrl(queue.shift())
      }
    }

    return(
        <>
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
        </>
    )
}

export default Queue