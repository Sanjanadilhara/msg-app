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
const dataModule=require("./parseData");







let onlineUsers=new Map();
//consts

const INIT_OK=3;
const MSG_SENT_AND_RESPONSE_SENT=2;
const MSG_SENT_RESPOSE_NOT_SENT=1
const MSG_RECORDED=0;

//consts







const app = express();
const server = http.createServer(app);
const wss = new ws.Server({ server });


app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,
}));

const url = 'mongodb://localhost:27017';
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
    let msgData=new dataModule(data);
    if(msgData.fail){console.log("fail");return;};

    let result=new Object();
    let cookies=cookieHandle.parse(msgData.cookie);

    jwt.verify(cookies.auth, 'instmsg098', function(err, decoded){
      if(!err){

        let date=new Date();

          if(msgData.type=="init"){

            onlineUsers.set(decoded.id, ws);
            console.log("user gone online "+onlineUsers.size);
            ws.uid=decoded.id;


            result.type="init"
            result.stat=1;
            ws.send(JSON.stringify(result));


            db.collection("messages").find({to:new ObjectId(decoded.id), sent:MSG_RECORDED}).sort({date:1}).toArray()//send unsent messages
            .then((data)=>{
              data.forEach(element => {

                ws.send(JSON.stringify({type:"message", from:element.from, message:element.message, date:element.date}));
                sendResponse(element);

              });
            }).catch((res)=>{});




            db.collection("messages").find({from:new ObjectId(decoded.id), sent:MSG_SENT_RESPOSE_NOT_SENT}).sort({date:1}).toArray()//send unsent responses
            .then((data)=>{
              data.forEach(element => {

                ws.send(JSON.stringify({type:"messageStat", msgId:element.msgId, stat:element.sent}));
                //update the database message stat(sent);
                db.collection("messages").updateOne({_id:element._id}, {$set:{sent:MSG_SENT_AND_RESPONSE_SENT}}).then((res)=>{
                  console.log("msg Updated success")
                })
                .catch((res)=>{
                  console.log("fail to update");
                });
      
               });


            }).catch((res)=>{});


          }
          else if(msgData.type=="message"){

            let message=new dataModule.message(msgData);
            if(message.fail){return;}
            message.from=new ObjectId(decoded.id);
            message.date=date;


            if(onlineUsers.has(message.to.toString())){ //if user is online

              onlineUsers.get(message.to.toString()).send(JSON.stringify({from:decoded.id, message:message.message, date:date, type:"message"}));

              message.sent=MSG_SENT_AND_RESPONSE_SENT;
             
              console.log("message   "+message.msgId);

              db.collection('messages').insertOne(message)
              .then((res)=>{

                result.type="messageStat";
                result.stat=MSG_SENT_AND_RESPONSE_SENT;
                result.msgId=message.msgId;
                ws.send(JSON.stringify(result));

              })
              .catch((err)=>{

                result.type="messageStat";
                result.stat=-3;
                result.msgId=message.msgId;
                ws.send(JSON.stringify(result));


              });


            }
            else{   //if user is offline

              message.sent=MSG_RECORDED;

              db.collection('messages').insertOne(message).then((res)=>{
                result.stat=MSG_RECORDED;
                result.msgId=message.msgId;
                result.type="messageStat"
                ws.send(JSON.stringify(result));
              }).catch((err)=>{
                result.type="messageStat"
                result.msgId=message.msgId;
                result.stat=-3;
                ws.send(JSON.stringify(result));
              });


            }


          }
          else if(msgData?.type=="request"){

          }

          
        }else{
          result.stat=-2;
          result.type="auth";
          ws.send(JSON.stringify(result));
        }
    });
  
  });

  // ws.send('something');
});
server.listen(80)



function sendResponse(message){
  if(onlineUsers.has(message.from)){
    onlineUsers.get(message.from).send(JSON.stringify({type:"messageStat", msgId:message.msgId, stat:message.sent}));

    db.collection("messages").updateOne({_id:message._id}, {$set:{sent:MSG_SENT_AND_RESPONSE_SENT}}).then((res)=>{
      console.log("msg Updated success")
    })
    .catch((res)=>{
      console.log("fail to update");
    });
  }
  else{
    db.collection("messages").updateOne({_id:message._id}, {$set:{sent:MSG_SENT_RESPOSE_NOT_SENT}}).then((res)=>{
      console.log("msg Updated success")
    })
    .catch((res)=>{
      console.log("fail to update");
    });
  }
}