const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// S3 client singleton
let s3Client;

function getS3Client() {
  if (!s3Client) {
    s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  return s3Client;
}

// Generate presigned URL for uploads
async function createPresignedPostUrl(key, expiresIn = 3600) {
  const client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
  });

  const signedUrl = await getSignedUrl(client, command, { expiresIn });
  return signedUrl;
}

// Generate presigned URL for downloads/viewing
async function createPresignedGetUrl(key, expiresIn = 3600) {
  const client = getS3Client();
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
  });

  const signedUrl = await getSignedUrl(client, command, { expiresIn });
  return signedUrl;
}

// Generate S3 key for result images
function generateResultKey(generationId, extension = 'jpg') {
  const timestamp = Date.now();
  return `results/${generationId}_${timestamp}.${extension}`;
}

// Upload buffer directly to S3
async function uploadToS3(key, buffer, contentType) {
  const client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await client.send(command);

  // Return the public URL
  return `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

module.exports = {
  getS3Client,
  createPresignedPostUrl,
  createPresignedGetUrl,
  generateResultKey,
  uploadToS3
};