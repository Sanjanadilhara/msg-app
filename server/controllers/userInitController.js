const Messages = require("../models/messages");
const messages=require("../models/messages");


module.exports=function(db, data, currentUser,onlineUsers){
    let recivedMessages=new messages();
    recivedMessages.retriveMessages(db.collection('messages').find({to:data.from, sent:messages.MSG_RECORDED}), 
    (success, item)=>{
        if(success){
            currentUser.send(JSON.stringify(recivedMessages.prepareToSend(item)));
            item.sent=messages.MSG_SENT_RESPOSE_NOT_SENT;
            if(onlineUsers.has(item.from.toString())){
                item.sent=messages.MSG_SENT_AND_RESPONSE_SENT;
                onlineUsers.get(item.from.toString()).send(JSON.stringify(recivedMessages.prepareSendRespose(item)));
            }
        }else{
            console.log("data Retrive error userInitControll");
        }

    },
    (successAll)=>{
        if(successAll){
            recivedMessages.updateDataBase(db, (res, item)=>{
                if(!res){
                    console.log("fail to update ", item);
                }
            });
        }
        else{
            console.log("fail to update database");
        }
    });


    let msgResponses=new messages();
    msgResponses.retriveMessages(db.collection('messages').find({from:data.from, sent:Messages.MSG_SENT_RESPOSE_NOT_SENT}), 
    (success, item)=>{
        if(success){
            item.sent=messages.MSG_SENT_AND_RESPONSE_SENT;
            currentUser.send(JSON.stringify(msgResponses.prepareSendRespose(item)));
        }
    },
    (successAll)=>{
        if(successAll){
            msgResponses.updateDataBase(db, (res,item)=>{
                if(!res){
                    console.log("fail to update ", item);
                }
            });
        }
        else{
            console.log("fail to update database");
        }
    });
}