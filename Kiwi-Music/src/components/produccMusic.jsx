import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa';
import { FcMusic } from "react-icons/fc";
import 'tailwindcss/tailwind.css';

const API_KEY = '4619f4cbf2mshd6a2e2d71c5fab1p1aeba8jsne2dd9f9ae550';
const BASE_URL = 'https://spotify23.p.rapidapi.com';

const getRandomFamousSongs = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/playlist_tracks`, {
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'spotify23.p.rapidapi.com',
      },
      params: {
        id: '37i9dQZF1DXcBWIGoYBM5M',
        limit: 50,
      },
    });
    return data.items.map(({ track }) => track).filter(({ preview_url }) => preview_url);
  } catch (error) {
    console.error('Error fetching famous songs:', error);
    return [];
  }
};

const App = () => {
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    const fetchSongs = async () => setSongs(await getRandomFamousSongs());
    fetchSongs();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = songs[currentSongIndex]?.preview_url || '';
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [currentSongIndex, isPlaying, songs]);

  const updateProgress = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current;
      setProgress((currentTime / duration) * 100);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play();
    }
    setIsPlaying(prev => !prev);
  };

  const changeSong = (delta) => {
    setCurrentSongIndex(prevIndex => (prevIndex + delta + songs.length) % songs.length);
    setIsPlaying(true);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const { name = 'Loading...', artists = [], duration_ms = 0, album = {} } = songs[currentSongIndex] || {};
  const { images = [] } = album;
  const albumImage = images.length > 0 ? images[0].url : ''; 
  const duration = Math.floor(duration_ms / 1000);

  return (
    <>
      <p className="text-black text-2xl font-bold text-center mb-8">Lo más escuchado esta semana:</p>
      <div className="w-full max-w-md mx-auto bg-neutral-900 shadow-lg rounded-lg overflow-hidden">
        <div className="flex flex-col items-center px-6 py-4">
          {albumImage && (
            <img src={albumImage} alt={name} className="w-32 h-32 object-cover rounded-full mb-4 shadow-lg" />
          )}
          <div className="text-center">
            <h3 className="text-lg font-medium text-white mb-1"> <FcMusic /> {name}</h3>
            <p className="text-gray-400">{artists.map(({ name }) => name).join(', ')}</p>
          </div>
        </div>
        <audio
          ref={audioRef}
          onTimeUpdate={updateProgress}
          onEnded={() => changeSong(1)}
          className="hidden"
        />
        <div className="flex items-center justify-around bg-neutral-800 p-4">
          <button
            onClick={() => changeSong(-1)}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition duration-200"
          >
            <FaBackward size={20} />
          </button>
          <button
            onClick={togglePlayPause}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition duration-200 mx-4"
          >
            {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
          </button>
          <button
            onClick={() => changeSong(1)}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition duration-200"
          >
            <FaForward size={20} />
          </button>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center">
            <div className="w-full mx-3">
              <div className="relative h-2 bg-gray-700 rounded overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-yellow-500" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
            <p className="text-sm text-gray-400 ml-3">
              {formatTime((progress / 100) * duration)}
            </p>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>00:00</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
