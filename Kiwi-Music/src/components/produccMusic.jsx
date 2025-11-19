import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaPlay, FaPause, FaForward, FaBackward, FaSpotify } from 'react-icons/fa';
import 'tailwindcss/tailwind.css';

const styles = `
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  .album-spinning {
    animation: spin 20s linear infinite;
  }
`;

// Inyectar estilos
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

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

  const selectSong = (index) => {
    setCurrentSongIndex(index);
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
      <p className="text-4xl font-bold text-center mb-12 text-[#9DE0AD]">Lo más escuchado esta semana:</p>
      <div className="w-full lg:w-3/4 mx-auto px-4 mb-8">
        {/* Contenedor principal del reproductor */}
        <div className="bg-gradient-to-br from-[#547980] to-[#3d5a66] shadow-2xl rounded-2xl overflow-hidden mb-8 backdrop-blur-sm border border-[#9DE0AD] border-opacity-20">
          
          {/* Sección superior: Información de la canción - COMPACTA */}
          <div className="bg-gradient-to-r from-[#547980] to-[#4a6f7a] p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
              {/* Imagen del álbum - GIRATORIA */}
              {albumImage && (
                <div className="flex-shrink-0">
                  <img 
                    src={albumImage} 
                    alt={name} 
                    className={`w-32 h-32 lg:w-40 lg:h-40 object-cover rounded-full shadow-2xl border-4 border-[#9DE0AD] ${isPlaying ? 'album-spinning' : ''}`}
                  />
                </div>
              )}
              
              {/* Información de la canción */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                  <FaSpotify size={20} className="text-[#9DE0AD]" />
                  <h3 className="text-xl lg:text-2xl font-bold text-white truncate">{name}</h3>
                </div>
                <p className="text-gray-300 text-xs lg:text-sm mb-3">
                  {artists.map(({ name }) => name).join(', ')}
                </p>
                
                {/* Barra de progreso mejorada - COMPACTA */}
                <div className="mt-3">
                  <div className="relative h-1 bg-gray-600 rounded-full overflow-hidden cursor-pointer hover:h-1.5 transition-all duration-200">
                    <div 
                      className="h-full bg-gradient-to-r from-[#9DE0AD] to-[#7bc97f] rounded-full shadow-lg" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{formatTime((progress / 100) * duration)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controles de reproducción */}
          <div className="flex items-center justify-center gap-4 lg:gap-6 bg-[#547980] px-6 py-8">
            <button
              onClick={() => changeSong(-1)}
              className="h-12 w-12 lg:h-14 lg:w-14 flex items-center justify-center rounded-full bg-[#9DE0AD] text-[#547980] shadow-lg hover:shadow-xl hover:scale-110 transform transition duration-200 font-bold"
            >
              <FaBackward size={20} />
            </button>
            <button
              onClick={togglePlayPause}
              className="h-14 w-14 lg:h-16 lg:w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-[#9DE0AD] to-[#7bc97f] text-[#547980] shadow-xl hover:shadow-2xl hover:scale-110 transform transition duration-200 font-bold"
            >
              {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
            </button>
            <button
              onClick={() => changeSong(1)}
              className="h-12 w-12 lg:h-14 lg:w-14 flex items-center justify-center rounded-full bg-[#9DE0AD] text-[#547980] shadow-lg hover:shadow-xl hover:scale-110 transform transition duration-200 font-bold"
            >
              <FaForward size={20} />
            </button>
          </div>

          {/* Lista de canciones con scroll - MÁS GRANDE */}
          <div className="h-96 lg:h-[500px] overflow-y-auto bg-[#3d5a66] scrollbar-hide">
            <ul className="divide-y divide-gray-700">
              {songs.map((song, index) => (
                <li
                  key={song.id}
                  className={`p-5 flex items-center justify-between cursor-pointer transition-all duration-200 hover:scale-102 ${
                    currentSongIndex === index 
                      ? 'bg-gradient-to-r from-[#9DE0AD] from-20% to-[#547980] border-l-4 border-[#9DE0AD]' 
                      : 'hover:bg-[#4a6f7a]'
                  }`}
                  onClick={() => selectSong(index)}
                >
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold truncate text-sm lg:text-base ${currentSongIndex === index ? 'text-[#547980]' : 'text-white'}`}>
                      {song.name}
                    </p>
                    <p className={`text-xs truncate ${currentSongIndex === index ? 'text-[#547980] opacity-80' : 'text-gray-400'}`}>
                      {song.artists.map(({ name }) => name).join(', ')}
                    </p>
                  </div>
                  <button
                    className={`ml-4 h-10 w-10 flex items-center justify-center rounded-full shadow-md transition duration-200 flex-shrink-0 font-bold ${
                      currentSongIndex === index 
                        ? 'bg-[#547980] text-[#9DE0AD] scale-110 shadow-lg' 
                        : 'bg-[#9DE0AD] text-[#547980] hover:scale-125 hover:shadow-lg'
                    }`}
                  >
                    {currentSongIndex === index && isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
