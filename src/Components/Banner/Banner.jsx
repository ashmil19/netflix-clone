import React, { useEffect, useState } from 'react'
import {GridLoader} from 'react-spinners'
import Youtube from 'react-youtube'
import toast, {Toaster} from 'react-hot-toast'

import axios from '../../axios'
import {API_KEY, IMAGE_URL} from '../../constants/constants'
import './Banner.css'

function Banner() {
    const [movie, setMovie] = useState();
    const [popup, setPopup] = useState(false);
    const [prevToastId, setPrevToastId] = useState(null);
    const [urlId, setUrlId] = useState('');

    useEffect(() => {
        axios.get(`trending/all/week?api_key=${API_KEY}&language=en-US`)
        .then((response)=>{
            console.log(response.data.results[0]);
            setMovie(response.data.results[0])
        })
    }, []);

    const showToast = () =>{
        if(prevToastId){
            toast.dismiss(prevToastId);
        }
        const newToastId = toast.error('No trailer available', {
            duration: 3000,
        });
        setPrevToastId(newToastId);
    
    }

    const handleMovie = (id)=>{
        axios.get(`/movie/${id}/videos?api_key=${API_KEY}&language=en-US`)
        .then((response)=>{
            if(response.data.results.length !== 0){
                setUrlId(response.data.results[0]);
                console.log(response.data.results[0]);
                setPopup(true)
            } else{
                showToast();
            }
        })
    }

    const closeVideo = ()=>{
        setPopup(false)
    } 

    const opts = {
        height: '390',
        width: '100%',
        playerVars: {
          autoplay: 1,
        },
    };

    const outerStyle = {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    };

  return (
 
    <div style={!movie ? outerStyle : {color: 'white',}}>
        {!movie ? <GridLoader/> :<div
        style={{backgroundImage: `url(${movie ? IMAGE_URL+movie.backdrop_path : ""})`}} 
        className='banner'>
            <div className="content">
                <h1 className="title">{movie ? movie.title : ""}</h1>
                <div className="banner_buttons">
                    <button className="bnr-button" onClick={()=> handleMovie(movie.id)}>Play</button>
                    <button className="bnr-button">My List</button>
                </div>
                <h1 className="description">{movie ? movie.overview : ""}</h1>
            </div>
            <div className="fade_bottom"></div>
        </div>}
        {popup && <div className="video-popup">
            <div className="video-content">
                <div className='cls-btn' onClick={closeVideo}>X</div>
                <Youtube videoId={urlId.key} opts={opts} />
                <h2 className='video-title'>{urlId.name}</h2>
            </div>
        </div>}
        <Toaster />
    </div>


  )
}

export default Banner