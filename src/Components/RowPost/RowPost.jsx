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
          // https://developers.google.com/youtube/player_parameters
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
            } else{
                showToast();
            }
        })
    }

  return (
    <div className='row'>
        <h2>{props.title}</h2>
        <div className="posters">
            {movies.map((movie)=>{
                return <img key={movie.id} onClick={()=> handleMovie(movie.id)} className={props.isSmall ? 'smallPoster' :'poster'} src={`${IMAGE_URL+movie.backdrop_path}`} alt="poster" />
            })}
        </div>
        {urlId && <Youtube videoId={urlId.key} opts={opts} />}
        
        <Toaster />
    </div>
  )
}

export default RowPost