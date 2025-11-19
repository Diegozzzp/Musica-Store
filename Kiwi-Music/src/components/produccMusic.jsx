import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaPlay, FaPause, FaForward, FaBackward, FaSpotify } from 'react-icons/fa';
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
  const [progress, setProgress] = useState(0); // 0-100
  const [isPlaying, setIsPlaying] = useState(false);
  const [durationSec, setDurationSec] = useState(0);
  const [currentSec, setCurrentSec] = useState(0);

  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    const fetchSongs = async () => setSongs(await getRandomFamousSongs());
    fetchSongs();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      audio.src = songs[currentSongIndex]?.preview_url || '';
      // reset states when song changes
      setProgress(0);
      setCurrentSec(0);
      setDurationSec(0);
      if (isPlaying && audio.src) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    }
  }, [currentSongIndex, isPlaying, songs]);

  const updateProgress = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const { currentTime, duration } = audio;
    if (Number.isFinite(duration) && duration > 0) {
      setProgress(Math.min(100, Math.max(0, (currentTime / duration) * 100)));
      setCurrentSec(currentTime);
    } else {
      // duration unknown yet
      setProgress(0);
      setCurrentSec(currentTime || 0);
    }
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const { duration } = audio;
    if (Number.isFinite(duration) && duration > 0) {
      setDurationSec(duration);
    } else {
      setDurationSec(0);
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

  const selectSong = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const { name = 'Loading...', artists = [], duration_ms = 0, album = {} } = songs[currentSongIndex] || {};
  const { images = [] } = album;
  const albumImage = images.length > 0 ? images[0].url : ''; 
  // Use audio element duration if available (Spotify previews are ~30s)
  const duration = durationSec > 0 ? Math.floor(durationSec) : Math.floor(duration_ms / 1000) || 0;

  const handleSeek = (e) => {
    const bar = progressBarRef.current;
    const audio = audioRef.current;
    if (!bar || !audio) return;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.min(1, Math.max(0, clickX / rect.width));
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime = ratio * audio.duration;
      setCurrentSec(audio.currentTime);
      setProgress(ratio * 100);
    }
  };

  return (
    <>
      <p className="text-2xl md:text-4xl font-bold text-center mb-6 md:mb-8 text-[#9DE0AD]">Lo más escuchado esta semana:</p>
      <div className="w-full max-w-5xl mx-auto bg-[#547980] shadow-lg rounded-lg overflow-hidden mb-8 px-3 sm:px-4">
        {/* Información y control de la canción actual */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 px-3 sm:px-6 py-4 pt-6">
          {albumImage && (
            <img src={albumImage} alt={name} className="w-32 h-32 md:w-52 md:h-48 object-cover rounded mb-2 md:mb-0 shadow-lg" />
          )}
          <div className="md:pl-4">
            <h3 className="text-base md:text-lg font-medium text-white mb-1 flex items-center gap-2"><span className="truncate max-w-[60vw] md:max-w-none">{name}</span> <FaSpotify size={18} className="opacity-90" /></h3>
            <p className="text-gray-200 text-sm md:text-base">{artists.map(({ name }) => name).join(', ')} </p>
          </div>
        </div>
        <audio
          ref={audioRef}
          onTimeUpdate={updateProgress}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => changeSong(1)}
          className="hidden"
        />
        {/* Controles de reproducción */}
        <div className="flex items-center justify-end bg-[#547980] p-3 sm:p-4 w-full">
          <button
            onClick={() => changeSong(-1)}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-[#9DE0AD] text-white shadow-md hover:bg-blue-700 transition duration-200"
          >
            <FaBackward size={20} />
          </button>
          <button
            onClick={togglePlayPause}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-[#9DE0AD] text-white shadow-md hover:bg-blue-700 transition duration-200 mx-4"
          >
            {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
          </button>
          <button
            onClick={() => changeSong(1)}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-[#9DE0AD] text-white shadow-md hover:bg-blue-700 transition duration-200"
          >
            <FaForward size={20} />
          </button>
        </div>
        {/* Barra de progreso */}
        <div className="px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center">
            <div className="w-full mx-3">
              <div
                ref={progressBarRef}
                onClick={handleSeek}
                className="relative h-2 bg-gray-700 rounded overflow-hidden cursor-pointer"
                title="Click para adelantar/retroceder"
              >
                <div className="absolute top-0 left-0 h-full bg-yellow-500" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-black ml-3 min-w-[48px] text-right">
              {formatTime(currentSec)}
            </p>
          </div>
          <div className="flex justify-between text-xs sm:text-sm text-black mt-2">
            <span>00:00</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Lista de canciones con scroll */}
        <div className="h-56 sm:h-64 overflow-y-auto bg-[#547980]">
          <ul className="divide-y divide-gray-700">
            {songs.map((song, index) => (
              <li
                key={song.id}
                className={`p-3 sm:p-4 flex items-center justify-between cursor-pointer ${currentSongIndex === index ? 'bg-gray-700/50' : ''}`}
                onClick={() => selectSong(index)}
              >
                <div>
                  <p className="text-white text-sm sm:text-base">{song.name}</p>
                  <p className="text-gray-300 text-xs sm:text-sm">{song.artists.map(({ name }) => name).join(', ')}</p>
                </div>
                <button
                  className="h-8 w-8 flex items-center justify-center rounded-full bg-[#9DE0AD] text-white shadow-md hover:bg-blue-700 transition duration-200 flex-shrink-0"
                >
                  {currentSongIndex === index && isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default App;
