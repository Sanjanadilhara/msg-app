const requests=require("../models/requests");
const {MongoClient,  ObjectId}  = require('mongodb');


module.exports=function(db, data, currentUser,  onlineUsers){
    let requestsData=new requests();
    
    if(data?.accept==1){
        data.to=data.uid;

        if(data?.from===undefined){
            return;
        }

        requestsData.retriveRequests(db.collection('requests').find({to:data.to, from:new ObjectId(data.from)}), 
        (succes, item)=>{
            if(onlineUsers.has(item.from.toString())){
                onlineUsers.get(item.from.toString()).send(JSON.stringify(requestsData.prepareAccept(item)));
                item.stat=requests.REQ_ACCEPT_RESPOND_SENT;
                currentUser.send(JSON.stringify(requestsData.prepareAcceptRespond(item)))
            }
            else{
                item.stat=requests.REQ_ACCEPTED;
            }
        }, 
        (success)=>{
            requestsData.updateDataBase(db, (res, item)=>{
                if(!success){
                    item.stat=-1;
                    currentUser.send(JSON.stringify(requestsData.prepareAccept(item)));
                }
            });
        });
        
    }
    else{
        data.from=data.uid;
        requestsData.addRequest(data);
        
        requestsData.updateDataBase(db, (succes, data)=>{
    
            if(succes){
                if(onlineUsers.has(data.to.toString())){
                    onlineUsers.get(data.to.toString()).send(JSON.stringify(requestsData.prepareToSend(data)));
                    data.stat=requests.REQ_SENT;
                    currentUser.send(JSON.stringify(requestsData.prepareSendRespose(data)));
    
                }
                else{
                    data.stat=requests.REQ_RECORDED;
                    currentUser.send(JSON.stringify(requestsData.prepareSendRespose(data)));
                }    
                requestsData.updateDataBase(db, (succes, data)=>{
                    if(!succes){
                        console.log("msg update fail", data);
                    }
                });
    
            }
            else{
                data.stat=-1;
                currentUser.send(JSON.stringify(requestsData.prepareSendRespose(data)));
            }
        });

    }


}