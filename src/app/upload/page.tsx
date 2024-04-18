'use server';

import UploadForm from './UploadForm';

export default async function UploadFile() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <UploadForm />
    </div>
  );
}
