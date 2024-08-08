// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaPlay, FaPause, FaForward, FaBackward} from 'react-icons/fa';
import { FcMusic } from "react-icons/fc";

import 'tailwindcss/tailwind.css';

const API_KEY = '75f1a782afmsh018ec0dc00359a7p171ae0jsn0f386a250157';
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

  const { name = 'Loading...', artists = [], duration_ms = 0, album = {} } = songs[currentSongIndex] || {};
  const { images = [] } = album;
  const albumImage = images.length > 0 ? images[0].url : ''; 
  const duration = Math.floor(duration_ms / 1000);

  return (
    <>
    <p className="text-black text-2xl font-bold  text-center mb-16">Lo mas escuchado esta semana es:</p>
    <div className="w-full max-w-[500px] mx-auto bg-neutral-800	 shadow-md rounded-lg overflow-hidden dark:bg-zinc-900 mb-16">
      <div className="flex flex-col items-center px-6 py-4">
        {albumImage && (
          <img src={albumImage} alt={name} className="w-24 h-24 object-cover rounded-full mb-4" />
        )}
        <div className="text-center">
          <h3 className="text-lg font-medium text-white dark:text-gray-200"> <FcMusic /> {name}</h3>
          <p className="text-white dark:text-gray-400">{artists.map(({ name }) => name).join(', ')}</p>
        </div>
      </div>
      <audio
        ref={audioRef}
        onTimeUpdate={updateProgress}
        onEnded={() => changeSong(1)}
        className="hidden"
      />
      <div className="relative flex items-center justify-around">
        <button
          onClick={() => changeSong(-1)}
          className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-md hover:bg-blue-600"
        >
          <FaBackward size={24} />
        </button>
        <button
          onClick={togglePlayPause}
          className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-md hover:bg-blue-600 mx-4"
        >
          {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
        </button>
        <button
          onClick={() => changeSong(1)}
          className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-md hover:bg-blue-600"
        >
          <FaForward size={24} />
        </button>
      </div>
      <div className="px-6 py-4">
        <div className="flex items-center">
          <div className="w-full mx-3">
            <div className="relative mt-1 h-1 bg-gray-200 rounded overflow-hidden dark:bg-gray-800">
              <div className="absolute top-0 left-0 h-full bg-yellow-500" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {Math.floor(progress * duration / 100)}s
          </p>
        </div>
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-3">
          <span>00:03</span><span>{String(Math.floor(duration / 60)).padStart(2, '0')}:{String(duration % 60).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
    </>
  );
};

export default App;
