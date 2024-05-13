import {
  PutObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_REGION;

const client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
  region: bucketRegion,
});

const uploadToBucket = async (body, keyname) => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: keyname,
    Body: body,
    ContentType: "video/webm",
  });
  const response = await client.send(command);
  console.log(response);
  return keyname;
};

const getVideo = async (keyname) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: keyname,
    ContentType: "video/webm",
  });
  const response = await client.send(command);
  console.log(response);
  return response.Body;
  //var videoBlob = new Blob([data.Body], { type: 'video/mp4' }); video 틀 때 blob으로 변경 후 src에 넣어야 함
};

export { uploadToBucket, getVideo };
