const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const bodyParser = require('body-parser');
var mysql = require('mysql');
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const https = require('https');



var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'sanjana',
  database : 'msgApp'
});

connection.connect();

const app = express();
var httpServer = http.createServer(app);
var httpsServer = https.createServer( {key: fs.readFileSync('server.key', 'utf8'), cert: fs.readFileSync('server.cert', 'utf8')}, app);


app.use(cookieParser());
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var jsonParser = bodyParser.json()


app.get("/reset", function(req, res){
  res.clearCookie('auth');
  console.log("cookie  reset");
  res.redirect("/");
  res.end();
});


//entry
app.get('/', function (req, res) {

  if(req.cookies.auth===undefined){
    fs.readFile('index.html', function(err, data){
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });
  }
  else{
    var decoded = jwt.verify(req.cookies.auth, 'aaaaaa');
    if(decoded.id===undefined){

      fs.readFile('index.html', function(err, data){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      });
    }
    else{
      connection.query(`SELECT * FROM users WHERE user_id=${decoded.id}`, function (error, results, fields) {
        if (error) throw error;
        res.send("welcome back "+ results[0].name+"    <a href='\\reset'>logout</a>");
      });

    }
  }



})

app.post('/login', urlencodedParser,  function(req, res){

  console.log(req.body.email);
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(req.headers['content-type']);
  res.write(req.body.email);
  res.end();
});

app.post('/loginhl', jsonParser, function(req, res){

  connection.query(`SELECT * FROM users WHERE email=\"${req.body.email}\"`, function (error, results, fields) {
    if (error) throw error;

    if(results.length === 0){
      var user={
        data: "",
        name: "",
        age:"",
        error:"no user exist"
      };
      res.json(user);
      res.end();
    }
    else{
      bcrypt.compare(req.body.password, results[0].pass, function(err, result) {
        if(result){
          var user={
            data: req.body,
            name:results[0].name,
            age:23
          };

          var token = jwt.sign({ id: results[0].user_id}, 'aaaaaa');
          res.cookie("auth", token);

          console.log(req.body);
          res.json(user);
          res.end();
        }
        else{
          var stat={
            "err":"password incorrect"
          };
          res.json(stat);
          res.end();
        }
      });
    }


  });



});
app.get('/signup', function(req, res){
  fs.readFile('signup.html', function(err, data){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
});

app.post('/signup',  jsonParser, function(req, res){

  bcrypt.hash(req.body.password, 10, function(err, hash) {
    connection.query(`INSERT INTO users (name, email, pass) VALUES (\'${req.body.name}\', \'${req.body.email}\', \'${hash}\')`, function (error, results, fields) {
      if (error) throw error;
      var stat={
        "signup" : "success"
      };
      res.json(stat);
      res.end();
  });

});
});

app.post('/loginhl2', jsonParser, function(req, res){
  var user={
    data: req.body,
    age:23
  };
  console.log(req.body);
  res.json(user);
  res.end();
});

// httpServer.listen(8090, () => {
//   console.log(`HTTP Server is running on http://localhost:8090`);
// });

httpsServer.listen(8091, () => {
  console.log(`HTTPS Server is running on https://localhost:8091`);
});