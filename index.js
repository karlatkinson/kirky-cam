var cp = require('child_process');
var fs = require('fs');
var Ospry = require('ospry');
var easyimg = require('easyimage');
var Slack = require('slack-node');
var moment = require('moment');

cp.execFile('./tools/CommandCam', ['/devname', 'Microsoft LifeCam Cinema', '/filename', 'image.bmp'], function (error, stdout, stderr) {
    if (error) {
        console.log(error);
        console.log(stderr);
    }
    console.log(stdout);

    easyimg.convert({
        src: 'image.bmp',
        dst: './images/image_' + moment().unix() + '.gif'
    }).then(
        function (image) {
            console.log('Converted image: ' + image.name);
            upload(image.name);
        },
        function (err) {
            console.log(err);
        }
    );


});

function upload(imageName) {
    console.log('uploading ' + imageName);
    var ospry = new Ospry('sk-test-ib1oj6u1z7iscyg6jvejbjk1');
    var fstream = fs.createReadStream('./images/' + imageName);
    var uploader = ospry.up({
        filename: imageName,
        imageReady: function (err, imgMetadata) {
            if (err) {
                return console.log(err);
            }
            console.log('done upload');
            console.log(imgMetadata);
            sendToSlack(imgMetadata.url);
        },
    });

    fstream.pipe(uploader);
}

function sendToSlack(imageUrl) {
    var slack = new Slack();
    slack.setWebhook('https://hooks.slack.com/services/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');

    var slackMessage = {
        channel: "#random",
        username: "kirky-cam",
        icon_emoji: ":camera:",
        text: 'kirky-cam took a photo: ' + imageUrl
    };

    slack.webhook(slackMessage, function (err, response) {
        if (err) {
            console.log('slack notify failed: ' + err);
        }

        console.log('notified slack');
    });
}
