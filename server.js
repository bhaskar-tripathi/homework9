// Dependencies
// =============================================================

var express = require("express");
var path = require("path");
var fs = require("fs");
const uuidv1 = require('uuid/v1');


// Sets up the Express App
// =============================================================

var app = express();
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(__dirname + '/public'));



app.get("/", function (req, res) {

    res.sendFile(path.join(__dirname, "public/index.html"));

});

app.get("/notes", function (req, res) {

    res.sendFile(path.join(__dirname, "public/notes.html"));

});

app.get("/api/notes", function (req, res) {

    fs.readFile(path.join(__dirname, "/db/db.json"), { encoding: "utf8" }, function (err, data) {
        if (err) throw err;
        res.json(JSON.parse(data))
    });

});

app.post("/api/notes", function (req, res) {

    var newNote = JSON.stringify(req.body);
    fs.readFile(path.join(__dirname, "/db/db.json"), { encoding: "utf8" }, function (err, data) {
        if (err) throw err;
        var savedNotesArray = JSON.parse(data)
        req.body.id = uuidv1();
        savedNotesArray.push(req.body);
        var savedNotesJSONString = JSON.stringify(savedNotesArray);
        fs.writeFile(path.join(__dirname, "/db/db.json"), savedNotesJSONString, (err) => {
            if (err) throw err;
            console.log('The note added to file!');
            res.json(req.body);
        });
    });

});

app.delete("/api/notes/:id", function (req, res) {

    var id = req.params.id;

    fs.readFile(path.join(__dirname, "/db/db.json"), { encoding: "utf8" }, function (err, data) {
        if (err) throw err;
        var savedNotesArray = JSON.parse(data)
        if (id !== undefined) {
            saveNotesFiltered = savedNotesArray.filter((savedNote) => {
                if (savedNote.id !== id) { console.log(savedNote); return savedNote };
            })

            var savedNotesJSONString = JSON.stringify(saveNotesFiltered);
            fs.writeFile(path.join(__dirname, "/db/db.json"), savedNotesJSONString, (err) => {
                if (err) throw err;
                console.log(`The note with id ${id} has been deleted from file!`);
            });
        }
        
      });
});


app.listen(PORT, function () {
    console.log("Notes Taker app Server is listening at port " + PORT);
})