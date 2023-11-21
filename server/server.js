const express = require('express');
const ws = require('ws');
const http=require('http');
const cors = require('cors');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser');
const {MongoClient,  ObjectId}  = require('mongodb');
const e = require('express');
const cookieHandle=require('./cookieParse');







let onlineUsers=new Map();








const app = express();
const server = http.createServer(app);
const wss = new ws.Server({ server });


app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,
}));

const url = 'mongodb://localhost:27018';
const client = new MongoClient(url);
var db=undefined;

client.connect().then((result) => {
  db=client.db('instmsg');
  console.log(`succesfully connected to db ${url} `);
  
}).catch((err) => {
  console.log(`can't connect to ${url}`);
});

app.get('/', function (req, res) {
  jwt.verify(req.cookies.auth, 'instmsg098', function(err, decoded) {
    if(!err){
      let idob=new ObjectId(decoded.id);
      db.collection('users').find({ _id:idob}).toArray().then((data)=>{
        res.json({status:1, msg:`Hi ${data[0]["email"]}`})
      }).catch((err)=>{
        res.json({status:-1});
      });
    } 
    else{
      res.json({status:-1});
    }
  });
});


app.post('/signup', function(req, res){
  // console.log(req.body.email);
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    db.collection('users').insertMany([{email:req.body.email, password:hash}]).then((result)=>{
      res.json({status:1});
    }).catch((err)=>{
      res.json({status:0});
    });
  });
});

app.post('/login', function(req, res){
  
  // let ob=new ObjectId(req.body.email);
  db.collection('users').find({ email:req.body.email }).toArray().then((data)=>{

    bcrypt.compare(req.body.password, data[0]["password"], function(err, result) {

      if(result==true){
        let token = jwt.sign({ id: data[0]["_id"].toString() }, 'instmsg098');
        res.cookie("auth", token);
        res.json({status:1});
      }
      else{
        res.json({status:-2});
      }
    }); 
  }).catch((err)=>{
    res.json({status:-1});
  });

  
});

// app.listen(80,  function(){
//     console.log("listening on 80");
// });






wss.on('connection', function connection(ws) {
  ws.on('error', console.error);
  
  ws.on('close', function close(){
      onlineUsers.delete(ws?.uid);
      console.log("user gone offline "+onlineUsers.size);
  });

  ws.on('message', function message(data) {
    let msgData;
    try{
      msgData=JSON.parse(data);
    }catch{
      return 1;
    }
    let result={msgId:msgData.msgId, stat:-1};
    let cookies=cookieHandle.parse(msgData.cookie);

    jwt.verify(cookies.auth, 'instmsg098', function(err, decoded){
      if(!err){

          if(!(msgData?.init === undefined)){
            onlineUsers.set(decoded.id, ws);
            console.log("user gone online "+onlineUsers.size);
            ws.uid=decoded.id;
            result.stat=1;
            ws.send(JSON.stringify(result));
          }else{

            if(onlineUsers.has(msgData.to)){
              onlineUsers.get(msgData.to).send(JSON.stringify({from:decoded.id, message:msgData.message}));
              db.collection('messages').insertOne({from:new ObjectId(decoded.id), to:new ObjectId(msgData.to), message:msgData.message, sent:1}).then((res)=>{
                result.stat=2;
                ws.send(JSON.stringify(result));
              }).catch((err)=>{
                result.stat=-3;
                ws.send(JSON.stringify(result));
              });
            }
            else{
              db.collection('messages').insertOne({from:new ObjectId(decoded.id), to:new ObjectId(msgData.to), message:msgData.message, sent:0}).then((res)=>{
                result.stat=2;
                ws.send(JSON.stringify(result));
              }).catch((err)=>{
                result.stat=-3;
                ws.send(JSON.stringify(result));
              });
            }


          }
          
        }else{
          result.stat=-2;
          ws.send(JSON.stringify(result));
        }
    });
  
  });

  // ws.send('something');
});
server.listen(80)
// const httpServer=http.createServer((req, res)=>{
//   res.writeHead(200, { 'Content-Type': 'text/plain' });
// });


// httpServer.listen(82, ()=>{

// });