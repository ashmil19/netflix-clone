import React, {useEffect, useRef, useState} from 'react'
import Youtube from 'react-youtube'
import toast, {Toaster} from 'react-hot-toast'
import {API_KEY, IMAGE_URL} from '../../constants/constants'
import './RowPost.css'
import axios from  '../../axios'

function RowPost(props) {
    const [movies, setMovies] = useState([]);
    const [urlId, setUrlId] = useState('');
    const [prevToastId, setPrevToastId] = useState(null);
    const [popup, setPopup] = useState(false);

    useEffect(() => {
        axios.get(props.url)
        .then((response)=>{
            setMovies(response.data.results)
        })
        .catch(err=>{
            alert('Network Error')
        })
    }, []);

    const opts = {
        height: '390',
        width: '100%',
        playerVars: {
          autoplay: 1,
        },
    };

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
            console.log(response.data);
            if(response.data.results.length !== 0){
                setUrlId(response.data.results[0]);
                setPopup(true)
            } else{
                showToast();
            }
        })
    }

    const closeVideo = ()=>{
        setPopup(false)
    } 

  return (
    <div className='row'>
        <h2>{props.title}</h2>
        <div className="posters">
            {movies.map((movie)=>{
                return <img key={movie.id} onClick={()=> handleMovie(movie.id)} className={props.isSmall ? 'smallPoster' :'poster'} src={`${IMAGE_URL+movie.backdrop_path}`} alt="poster" />
            })}
        </div>
        {popup && <div className="video-popup">
            <div className="video-content">
                <div className="cls-btn" onClick={closeVideo}>X</div>
                <Youtube videoId={urlId.key} opts={opts} />
                <h2 className='video-title'>{urlId.name}</h2>
            </div>
        </div>}
        
        <Toaster />
    </div>
  )
}

export default RowPost