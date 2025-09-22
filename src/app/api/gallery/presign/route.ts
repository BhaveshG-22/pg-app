import { NextRequest, NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const runtime = "nodejs";

const s3 = new S3Client({ 
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse request body
    const { keys }: { keys: string[] } = await req.json();

    if (!keys || !Array.isArray(keys)) {
      return NextResponse.json(
        { error: 'Missing or invalid keys array' },
        { status: 400 }
      );
    }

    // 3. Generate presigned URLs for all keys
    const urls = await Promise.all(keys.map(async (keyOrUrl: string) => {
      try {
        // Extract S3 key from full URL if it's a URL, otherwise use as-is
        let s3Key = keyOrUrl;
        if (keyOrUrl.startsWith('https://')) {
          // Extract S3 key from full URL
          const bucket = process.env.S3_BUCKET!;
          const region = process.env.AWS_REGION!;
          const baseUrl = `https://${bucket}.s3.${region}.amazonaws.com/`;
          s3Key = keyOrUrl.replace(baseUrl, '');
        }

        console.log(`Processing: Original="${keyOrUrl}", S3Key="${s3Key}"`);

        const cmd = new GetObjectCommand({
          Bucket: process.env.S3_BUCKET!,
          Key: s3Key,
          ResponseContentType: "image/*" // Allow any image type
        });
        const presignedUrl = await getSignedUrl(s3, cmd, { expiresIn: 3600 }); // 1 hour TTL
        return { key: keyOrUrl, url: presignedUrl, success: true };
      } catch (error) {
        console.error(`Failed to generate presigned URL for key: ${keyOrUrl}`, error);
        return { key: keyOrUrl, url: null, success: false, error: 'Failed to generate URL' };
      }
    }));

    return NextResponse.json({ urls });

  } catch (error) {
    console.error('Presign gallery URLs error:', error);
    return NextResponse.json(
      { error: 'Failed to generate presigned URLs' },
      { status: 500 }
    );
  }
}