import { useState } from 'react'
import ReactPlayer from 'react-player'
import React from 'react'

const Queue = () => {
    const [queue, setQueueItem] = useState([])
    const [urlInput, setUrlInput] = useState('')

    const addQueueEvent = (url) => {
        if(ReactPlayer.canPlay(url)){
          setQueueItem([...queue, url])
        }
        else{
          console.log("Error!")
          console.log(url)
        }
    }

    return(
        <>
            <input
                type="url"
                name="url"
                id="url-input"
                placeholder="Enter video url"
                onChange={({target}) => setUrlInput(target.value)}
            />
            <button onClick={() => addQueueEvent(urlInput)}>Add to queue</button>
            <button>Skip</button>
            <ul>
                {queue.map(url => <li key={Math.random() * 100}>{url}</li>)}
            </ul>
        </>       
    )
}

export default Queue