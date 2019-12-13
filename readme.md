## About this AWS Lambda function
This is a simple AWS Lambda function which download files from input URLs and store those files in Amazon S3 storage.

## Environment variables
Following environment variables are necessary for this lambda function to execute. If not defined then lambda function throws errors.

| Key | Description |
| ------ | ------ |
| S3_BUCKET_NAME | Amazon S3 bucket name where files needs to be stored |
| PARALLEL_EXECUTION_LIMIT | Integer value defining limit on how many files are processed parallely. Set this value according to memory settings of lambda function and optimization required|


## Sample input Json body
Below is an example of input json body.

```json
{
  "files": [
    {
      "url":"https://www.example.com/content/uploads/IMG_0001cc.jpg"
    },
    {
      "url":"https://www.example.com/content/uploads/IMG_0002cc.jpg"
    },
    {
      "url":"https://www.example.com/content/uploads/IMG_0003cc.jpg"
    }
  ]
}
```

## Sample output Json body
Below is an example of output json body. for each input URL it returns following data attributes:
* **origurl** - source URL of file
* **s3Location** - s3 storage location
* **downloadTimeInMillis** - time taken to download file from input URL (in milliseconds)
* **uploadTimeInMillis** - time taken to upload file to S3 (in milliseconds)
* **fileSizeInBytes** - Total file size in bytes
* **s3Object** - additional information about stored s3 object

```json
{
  "files": [
    {
      "origurl": "https://www.example.com/content/uploads/IMG_0001cc.jpg",
      "s3Location": "https://yourbucketname.s3.ap-south-1.amazonaws.com/content/uploads/IMG_0001cc.jpg",
      "downloadTimeInMillis": 2790.4361,
      "uploadTimeInMillis": 399.451915,
      "fileSizeInBytes": 109939,
      "s3Object": {
        "ETag": "\"d29d0059f122af1b4f656af8263171c1\"",
        "Location": "https://yourbucketname.s3.ap-south-1.amazonaws.com/content/uploads/IMG_0001cc.jpg",
        "Key": "content/uploads/IMG_0001cc.jpg",
        "Bucket": "yourbucketname"
      }
    },
    {
      "origurl": "https://www.example.com/content/uploads/IMG_0002cc.jpg",
      "s3Location": "https://yourbucketname.s3.ap-south-1.amazonaws.com/content/uploads/IMG_0002cc.jpg",
      "downloadTimeInMillis": 3738.2203680000002,
      "uploadTimeInMillis": 316.183503,
      "fileSizeInBytes": 453762,
      "s3Object": {
        "ETag": "\"97bd20da7b12d82d7fa6390aa3566a7c\"",
        "Location": "https://yourbucketname.s3.ap-south-1.amazonaws.com/content/uploads/IMG_0002cc.jpg",
        "Key": "content/uploads/IMG_0002cc.jpg",
        "Bucket": "yourbucketname"
      }
    },
    {
      "origurl": "https://www.example.com/content/uploads/IMG_0003cc.jpg",
      "s3Location": "https://yourbucketname.s3.ap-south-1.amazonaws.com/content/uploads/IMG_0003cc.jpg",
      "downloadTimeInMillis": 3798.454432,
      "uploadTimeInMillis": 221.192282,
      "fileSizeInBytes": 329212,
      "s3Object": {
        "ETag": "\"70e373b3c2a8d6276d175ae7c7e805f2\"",
        "Location": "https://yourbucketname.s3.ap-south-1.amazonaws.com/content/uploads/IMG_0003cc.jpg",
        "Key": "content/uploads/IMG_0003cc.jpg",
        "Bucket": "yourbucketname"
      }
    }
  ]
}
```