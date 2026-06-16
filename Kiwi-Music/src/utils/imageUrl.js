const API_URL = 'https://musica-store.vercel.app';

export const getImageUrl = (image, fallback = '/default-image.png') => {
  const value = Array.isArray(image) ? image[0] : image;

  if (!value) return fallback;
  if (typeof value === 'string' && value.startsWith('http')) return value;

  return `${API_URL}/uploads/${String(value).replace(/\\/g, '/')}`;
};
