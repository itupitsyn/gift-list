import axios from 'axios';

export const getFileFromObjectUrl = async (obj: string | null | undefined, fileName = 'file') => {
  if (!obj || !obj.startsWith('blob:')) return null;

  const response = await axios.get(obj, { responseType: 'blob' });
  const blob = response.data;
  const extension = blob.type.split('/')[1];
  const file = new File([blob], `${fileName}.${extension}`, { type: blob.type });

  return file;
};

export const getImageUrl = (fileName: string | null | undefined) => {
  if (!fileName) return null;

  return `/api/image/${fileName}`;
};
