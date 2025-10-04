const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

let s3Client = null;

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

async function uploadImageToS3(imageBuffer, generationId, userId) {
  const timestamp = Date.now();
  const key = `results/${userId}/${generationId}-${timestamp}.webp`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: imageBuffer,
    ContentType: 'image/webp',
    // Remove ACL - bucket should have public read policy instead
  });

  await getS3Client().send(command);
  return key;
}

async function createPresignedGetUrl(key, expiresIn = 86400) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ResponseContentType: 'image/*',
  });

  return getSignedUrl(getS3Client(), command, {
    expiresIn,
    unhoistableHeaders: new Set(['x-amz-checksum-mode'])
  });
}

async function createPresignedPutUrl(key, contentType, expiresIn = 300) {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: contentType,
    // Remove ACL - bucket should have public read policy instead
  });

  return getSignedUrl(getS3Client(), command, { expiresIn });
}

// Upload with public read access for external services like Replicate
async function uploadImageToS3WithPublicAccess(imageBuffer, userId, fileName) {
  const key = `uploads/${userId}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: imageBuffer,
    ContentType: 'image/png',
    // Remove ACL - bucket should have public read policy instead
  });

  await getS3Client().send(command);
  return key;
}

// Get public URL (no signing needed for public objects)
function getPublicS3Url(key) {
  const bucket = process.env.S3_BUCKET;
  const region = process.env.AWS_REGION;
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

function generateResultKey(userId, generationId) {
  const timestamp = Date.now();
  return `results/${userId}/${generationId}-${timestamp}.webp`;
}

function s3KeyToUrl(s3Key) {
  const bucket = process.env.S3_BUCKET;
  const region = process.env.AWS_REGION;
  return `https://${bucket}.s3.${region}.amazonaws.com/${s3Key}`;
}

module.exports = {
  getS3Client,
  uploadImageToS3,
  createPresignedGetUrl,
  createPresignedPutUrl,
  generateResultKey,
  s3KeyToUrl,
  uploadImageToS3WithPublicAccess,
  getPublicS3Url
};