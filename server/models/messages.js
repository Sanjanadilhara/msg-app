const {MongoClient,  ObjectId}  = require('mongodb');



class Messages{
    static MSG_SENT_AND_RESPONSE_SENT=2;
    static MSG_SENT_RESPOSE_NOT_SENT=1
    static MSG_RECORDED=0;

    constructor(){
        this.messages=[];
      
    }

    prepareToSend(item){
        return {type:"message", message:item.message, from:item.from.toString(), date:item.date};
    }
    prepareSendRespose(item){
        return {type:"msgRespose", to:item.to.toString(), msgId:item.msgId, sent:item.sent};
    }

    addMessage(obj){
        let temMsg=new Object();

        let temkeys=['from', 'to', '_id', 'message', 'sent', 'date', 'msgId'];
        for(const [key, value] of Object.entries(obj)){
            if(temkeys.includes(key)){
                if((key=='_id' || key=='from' || key=='to') &&  typeof value == 'string'){
                   temMsg[key]=new ObjectId(value); 
                }
                else{
                    temMsg[key]=value;
                }
            }
        }
        this.messages.push(temMsg);
    }


    retriveMessages(qry, execUpdated, execAllUpdated){
        qry.toArray().then((data)=>{
            data.forEach((item)=>{
                this.addMessage(item);
                execUpdated(true, this.messages[this.messages.length-1]);
            });
            execAllUpdated(true);
        }).catch((res)=>{execAllUpdated(false);});

    }

    updateDataBase(db, resExec){
        this.messages.forEach((item)=>{
            if(item?.from!=undefined && item?.to != undefined && item?.message != undefined){
                if(item?._id===undefined){
                    item.date=new Date();
                    item.sent=Messages.MSG_RECORDED;
                    db.collection("messages").insertOne(item).then((res)=>{
                        resExec(true, item);
                    }).catch((err)=>{
                        console.log("fail to insert data", item);
                        resExec(false, item);
                    });
                }else{
                    let setData=(item?.sent===undefined)?{message:item.message}:{sent:item.sent, message:item.message};
                    db.collection("messages").updateOne({_id:item._id}, {$set:setData}).then((res)=>{
                        resExec(true, item);
                    }).catch((err)=>{
                        console.log("fail to update data", item);
                        resExec(false, item);
                    });
                }
            }
            else{
                console.log("missing data", item);
                resExec(false, item);
            }
        });
    }
}

module.exports=Messages;