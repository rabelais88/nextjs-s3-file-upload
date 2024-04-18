'use client';

import { useState, useTransition } from 'react';
import { submitImage } from './serverAction';

const UploadForm = () => {
  // form action does not support re-rendering
  // unless it is rendered with 'useTransition'
  const [pending, onTransition] = useTransition();
  const [uploadState, setUploadState] = useState('idle');
  const [imgUrl, setImgUrl] = useState('');

  const onSubmit = async (formData: FormData) => {
    const imgFile = formData.get('image') as File | null;
    if (!imgFile) return;
    const url = await submitImage(formData);
    if (url === '') {
      setUploadState('upload fail');
      return;
    }
    setUploadState('file uploaded');
    setImgUrl(url);
  };

  return (
    <form
      action={(formData: FormData) => {
        onTransition(() => {
          onSubmit(formData);
        });
      }}
      className="flex flex-col"
    >
      {!pending && <p>upload state: {uploadState}</p>}
      {pending && <p>uploading...</p>}
      {imgUrl && (
        <a href={imgUrl} target="_blank">
          {imgUrl}
        </a>
      )}
      <input type="file" name="image" />
      <button type="submit" disabled={pending}>
        upload
      </button>
    </form>
  );
};

export default UploadForm;
