const Messages = require("../models/messages");
const messages=require("../models/messages");
const requests=require("../models/requests");


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

    let requestsData=new requests();
    requestsData.retriveRequests(db.collection('requests').find({to:data.from, stat:requests.REQ_RECORDED}),
    (success, item)=>{
        if(success){
            requestsData.prepareToSend(item, db, currentUser);
            item.stat=requests.REQ_SENT;
        }
    }, 
    (allSuccess)=>{
        if(allSuccess){
            requestsData.updateDataBase(db, (success, item)=>{
                if(!success){
                    console.log("db update error init controll requests");
                }
            });
        }
        else{console.log("request db update error");}
    });

    let acceptedRequests=new requests();
    acceptedRequests.retriveRequests(db.collection('requests').find({from:data.from, stat:requests.REQ_ACCEPTED}), 
    (success, item)=>{
        currentUser.send(JSON.stringify(acceptedRequests.prepareAcceptRespond(item)));
        item.stat=requests.REQ_ACCEPT_RESPOND_SENT;
    }, 
    (success)=>{
        acceptedRequests.updateDataBase(db, (success, item)=>{
            if(!success){
                console.log("db update error init controll accept requests");
            }
        });
    });
}