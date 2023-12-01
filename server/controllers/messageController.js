const messages=require("../models/messages");


module.exports=function(db, data, currentUser,  onlineUsers){
    let messageData=new messages();
    messageData.addMessage(data);
    messageData.updateDataBase(db, (succes, data)=>{

        if(succes){
            if(onlineUsers.has(data.to.toString())){
                onlineUsers.get(data.to.toString()).send(JSON.stringify(messageData.prepareToSend(data)));
                data.sent=messages.MSG_SENT_AND_RESPONSE_SENT;
                currentUser.send(JSON.stringify(messageData.prepareSendRespose(data)));

            }
            else{
                data.sent=messages.MSG_RECORDED;
                currentUser.send(JSON.stringify(messageData.prepareSendRespose(data)));
            }    
            messageData.updateDataBase(db, (succes, data)=>{
                if(!succes){
                    console.log("msg update fail", data);
                }
            });

        }
        else{
            data.sent=-1;
            currentUser.send(JSON.stringify(messageData.prepareSendRespose(data)));
        }
    });
}