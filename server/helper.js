var AWS = require('aws-sdk');
var fs = require('fs');

var s3 =  new AWS.S3({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.S3_REGION
});

uploadFile = function(file, _user, stamp){
  console.log(file);
  var buffer = new Buffer(file, 'base64');
  var filename = 'minhaarvore/' + _user + stamp + '.jpg';

  var params = {
      Bucket: 'compcult',
      Key: filename,
      Body: buffer,
      ACL: 'public-read',
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg',
  };        

  s3.putObject(params, function (resp) {
    console.log('Successfully uploaded package.');
  });
}