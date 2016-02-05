var cp = require('child_process');
var fs = require('fs');
var Ospry = require('ospry');
var easyimg = require('easyimage');

cp.execFile('./tools/CommandCam', ['/devname', 'Microsoft LifeCam Cinema', '/filename', 'image.bmp'], function (error, stdout, stderr) {
    if (error) {
        console.log(error);
        console.log(stderr);
    }
    console.log(stdout);

    easyimg.convert({
        src: 'image.bmp',
        dst: './images/image.gif'
    }).then(
        function (image) {
            console.log('Converted image.');
            upload(image.name);
        },
        function (err) {
            console.log(err);
        }
    );


});

function upload(imageName) {
    var ospry = new Ospry('sk-test-ib1oj6u1z7iscyg6jvejbjk1');
    var fstream = fs.createReadStream('/images/' + imageName);
    var uploader = ospry.up({
        filename: imageName,
        imageReady: function (err, imgMetadata) {
            if (err) {
                return console.log(err);
            }
            console.log('done upload');
            console.log(imgMetadata);
        },
    });

    fstream.pipe(uploader);
}
