const url = require('url');
const request = require('request-promise');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const PARALLEL_EXECUTION_LIMIT = parseInt(process.env.PARALLEL_EXECUTION_LIMIT) || 1;

/**
 * Builds S3 key from given URL
 * @param {*} _url
 */
const buildKey = (_url) => url.parse(_url).pathname.substring(1);;

/**
 * Uploads a file to S3 bucket which is downloaded from given URL
 * @param {*} _url input file URL
 * @param {*} _outputFile info object about the file which is populated once it is uploaded to S3
 */
const uploadToS3 = async (_url, _outputFile) => {
  const startHrTimeDownload = process.hrtime();
  const fileResponse = await request({
    uri: _url,
    encoding: null,
    resolveWithFullResponse: true
  });
  const elapsedHrTimeDownload = process.hrtime(startHrTimeDownload);

  const startHrTimeUpload = process.hrtime();
  const uploadResponse = await s3.upload({
    Bucket: BUCKET_NAME,
    Key: buildKey(_url),
    ContentType: fileResponse.headers['content-type'],
    Body: fileResponse.body
  }).promise();
  const elapsedHrTimeUpload = process.hrtime(startHrTimeUpload);

  _outputFile.s3Location = uploadResponse.Location;
  _outputFile.downloadTimeInMillis = elapsedHrTimeDownload[0] * 1000 + elapsedHrTimeDownload[1] / 1e6;
  _outputFile.uploadTimeInMillis = elapsedHrTimeUpload[0] * 1000 + elapsedHrTimeUpload[1] / 1e6;
  _outputFile.fileSizeInBytes = parseInt(fileResponse.headers['content-length']);
  _outputFile.s3Object = uploadResponse;
  console.log('S3 upload result:', JSON.stringify(uploadResponse));
  return uploadResponse;
};

/**
 * processes next available URL in list until all URLs are proccessed
 * @param {*} _inputFiles array of URLs
 * @param {*} response response object containing array of output files
 */
const processNext = async (_inputFiles, response) => {
  while(_inputFiles.length > 0) {
    const _inputFile = _inputFiles.pop();
    console.log('processing file URL: ', _inputFile.url);
    const _outputFile = {
      origurl: _inputFile.url
    };
    response.files.push(_outputFile);
    await uploadToS3(_inputFile.url, _outputFile);
    console.log('FINISHED processing file URL: ', _inputFile.url);
  }
};

/**
 * runs operations over input array of files
 * @param {} _inputFiles
 */
const run = async (_inputFiles) => {
  const response = {
    files: []
  };

  const prallelTasks = [];
  for(let i = 0; i < PARALLEL_EXECUTION_LIMIT; i++) {
    prallelTasks.push(processNext(_inputFiles, response));
  }
  await Promise.all(prallelTasks);
  return response;
};


exports.handler = async (event, context) => {
  if(!BUCKET_NAME) throw new TypeError('Invalid S3 bucket name');
  if(PARALLEL_EXECUTION_LIMIT <= 0) throw new TypeError('Invalid parallel execution limit');

  console.log('S3 bucket name: ', BUCKET_NAME);
  console.log('PARALLEL EXECUTION LIMIT: ', PARALLEL_EXECUTION_LIMIT);

  console.log('event: ', JSON.stringify(event));
  return await run(event.files);
};