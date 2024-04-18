'use server';

import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
  },
});

export async function uploadFileS3(file: File, fileName: string) {
  const fileBuffer = (await file.arrayBuffer()) as Buffer;
  const params: PutObjectCommandInput = {
    Bucket: process.env.AWS_S3_BUCKET as string,
    Key: fileName,
    Body: fileBuffer,
    ContentType: file.type,
  };
  const command = new PutObjectCommand(params);
  await s3Client.send(command);
}

export const submitImage = async (formData: FormData) => {
  const image = formData.get('image');
  if (typeof image !== 'object' || !image || image?.size === 0) {
    return '';
  }
  // non-alphanumeric characters to alphanumeric characters
  // it produces filename easier to manage in code
  let asciiName = image.name.replace(/[^\x00-\x7F]/g, '').replace('', '_');
  const fileName = `${new Date().getTime()}-${asciiName}`;
  await uploadFileS3(image as File, fileName);
  // TODO: DB work with URL
  const url = `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${fileName}`;
  return url;
};
