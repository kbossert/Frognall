var express = require("express");
var app     = express();
var path    = require("path");
var axios    = require("axios");
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var db = mongojs('writings', ['authors']);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'views/authors/a')));
app.use(express.static(path.join(__dirname, 'views/authors/c')));
app.use(express.static(path.join(__dirname, '/')));

axios.get('https://api.github.com/users/codeheaven-io');

app.get('/', (req, res) => {
  // __dirname is the directory that contains the JavaScript source code.
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.post('/deleteAuthor', (req, res) => {

  console.log('Calls deleteAuthor');
  console.log(req.body.authorID);

  var results = "Author deleted.";

  db.authors.remove(
   { Name: req.body.authorID },
   function(err, result) {
       results = err;
   }
 );

  res.writeHead(200, {'Content-Type': 'text/json'});
  var json = JSON.stringify({
    Result: results
  });
  res.end(json);

});

app.post('/saveAuthor', (req, res) => {

  console.log('Calls saveAuthor');
  console.log(req.body.author);

  var results = "Author saved.";

  // In order to use this method, needed to make Name a unique index in the table.  At the command line I issued
  // db.authors.createIndex( { "Name": 1 }, { unique: true } )
  db.authors.update(
   { Name: req.body.author.Name },
   {
      Name: req.body.author.Name,
      Nationality: req.body.author.Nationality,
      Bio: req.body.author.Bio,
      Notes: req.body.author.Notes
   },
   { upsert: true },
   function(err, result) {
       results = err;
   }
 );

  res.writeHead(200, {'Content-Type': 'text/json'});
  var json = JSON.stringify({
    Result: results
  });
  res.end(json);

});

// app.get('/authors',function(req,res){
//   console.log('Authors called');
//
//   db.authors.find().toArray(function(err, docs) {
//       res.writeHead(200, {'Content-Type': 'text/json'});
//       var json = JSON.stringify({
//         Authors: docs
//       });
//       res.end(json);
//   });
//
// });

app.get('/getAuthor/:id', function(req,res){
  console.log('Get Author called');
  // console.log(req.params.id);
  // req.query.color to get a named parameter in the ?color=red format

  var query = { Name: new RegExp(req.params.id) };
  console.log(query);

  db.authors.find(query).toArray(function(err, docs) {
      res.writeHead(200, {'Content-Type': 'text/json'});
      var json = JSON.stringify({
        Author: docs[0]
      });
      res.end(json);
  });

});

app.get('/findAuthors/:id', function(req,res){
  console.log('Find Authors called');
  // console.log(req.params.id);
  // req.query.color to get a named parameter in the ?color=red format

  var query = { Name: new RegExp(req.params.id) };
  console.log(query);

  db.authors.find(query).toArray(function(err, docs) {
      res.writeHead(200, {'Content-Type': 'text/json'});
      var json = JSON.stringify({
        Authors: docs
      });
      res.end(json);
  });

});

app.post('/saveTitle', (req, res) => {

  console.log('Calls saveTitle');
  console.log(req.body.author);
  console.log(req.body.title);

  var results = "Title saved.";

  // In order to use this method, needed to make Name a unique index in the table.  At the command line I issued
  // db.authors.createIndex( { "Name": 1 }, { unique: true } )
  // db.authors.update(
  //  { Name: req.body.author.Name },
  //  {
  //     Name: req.body.author.Name,
  //     Nationality: req.body.author.Nationality,
  //     Bio: req.body.author.Bio,
  //     Notes: req.body.author.Notes
  //  },
  //  { upsert: true },
  //  function(err, result) {
  //      results = err;
  //  }
 //);

  res.writeHead(200, {'Content-Type': 'text/json'});
  var json = JSON.stringify({
    Result: results
  });
  res.end(json);

});

app.listen(3000);

console.log('Server running at http://127.0.0.1:3000');

// ES 6
// app.get('/', (req, res) => {
//   res.send('Hello Worlds');
// });

// Traditional
// app.get('/',function(req,res){
//   res.send('Hello World');
// });

// app.get('/header',function(req,res){
//   console.log('Well it calls it');
//   var author = "Kobo Abe";
//   res.writeHead(200, {'Content-Type': 'text/json'});
//   var json = JSON.stringify({
//     Author: author,
//     Title: "The Woman in the Dunes"
//   });
//   res.end(json);
// });


  // Straight insert code
  // db.authors.insert(req.body.author, function(err, result) {
  //   if (err) {
  //     result = err;
  //   }
  //   else {
  //     console.log('saved to database');
  //   }
  // });
