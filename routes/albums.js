var express  = require('express');
var router   = express.Router();
var Firebase = require('firebase');
var fbRef    = new Firebase('https://recordz.firebaseio.com');
var multer   = require('multer');
var upload   = multer({dest:'./public/images/uploads'});

// Home page:
router.get('/', function(req, res, next){
    res.render('albums/index.ejs');
});

router.get('/add', function(req, res, next){
    var genreRef = fbRef.child('genres');

    genreRef.once('value', function(snapshot){
        var myData = [];

        snapshot.forEach(function(childSnapshot){
            var myKey = childSnapshot.key(); // for ID
            var childData = childSnapshot.val(); // for name

            console.log("myKey = " + myKey);
            console.log("childData = " + childData.name);

            myData.push({
                id: myKey,
                name: childData.name
            });
        });

        res.render('albums/add', {genres: myData});
    });
});

router.post('/add', upload.single('cover'), function(req, res, next){
    if (req.file) {
        console.log("Uploading file...");
        var cover = req.file.filename;
    } else {
        console.log("No File Uploaded...");
        var cover = 'no-image.jpg'; // self created image
    }

    var album = {
        title: req.body.title,
        artist: req.body.artist,
        genre: req.body.genre,
        info: req.body.info,
        year: req.body.year,
        label: req.body.label,
        tracks: req.body.tracks,
        cover: cover
    }
    // create reference
    var albumRef = fbRef.child('albums');

    // push album:
    albumRef.push().set(album);

    req.flash('success_msg', 'Album Saved!');
    res.redirect('/albums');
});














// export
module.exports = router;