const express = require('express')
var path = require('path');
var fetchVideoInfo = require('youtube-info');

const app = express()
const port = process.env.PORT || 3000

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/templates/index.html'));
})

app.get('/playlist', function(req, res) {
    res.sendFile(path.join(__dirname + '/templates/playlist.html'));
})

app.get('/transform', function(req, res) {
    var url = req.query.url;
    var id = url.split("=")[1];

    fetchVideoInfo(id, function (err, videoInfo) {
        if (err) throw new Error(err);

        res.send({
            title: videoInfo.title,
            owner: videoInfo.owner,
            image: videoInfo.thumbnailUrl
        });
      });
})

app.listen(port, () => console.log(`Trennds Music listening on port ${port}!`))