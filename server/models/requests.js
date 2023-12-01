const {MongoClient,  ObjectId}  = require('mongodb');



class Requests{
    static REQ_ACCEPTED=2;
    static REQ_SENT=1
    static REQ_RECORDED=0;

    constructor(){
        this.requests=[];
      
    }

    prepareToSend(item){
        return {type:"message", message:item.message, from:item.from.toString(), date:item.date};
    }
    prepareSendRespose(item){
        return {type:"msgRespose", to:item.to.toString(), msgId:item.msgId, sent:item.sent};
    }

    addRequest(obj){
        let temReq=new Object();

        let temkeys=['from', 'to', '_id', 'stat', 'date'];
        for(const [key, value] of Object.entries(obj)){
            if(temkeys.includes(key)){
                if((key=='_id' || key=='from' || key=='to') &&  typeof value == 'string'){
                   temReq[key]=new ObjectId(value); 
                }
                else{
                    temReq[key]=value;
                }
            }
        }
        this.requests.push(temReq);
    }


    retriveMessages(qry, execUpdated, execAllUpdated){
        qry.toArray().then((data)=>{
            data.forEach((item)=>{
                this.addRequest(item);
                execUpdated(true, this.requests[this.requests.length-1]);
            });
            execAllUpdated(true);
        }).catch((res)=>{execAllUpdated(false);});

    }

    updateDataBase(db, resExec){
        this.requests.forEach((item)=>{
            if(item?.from!=undefined && item?.to != undefined ){
                if(item?._id===undefined){
                    item.date=new Date();
                    item.stat=Requests.REQ_RECORDED;
                    db.collection("requests").insertOne(item).then((res)=>{
                        resExec(true, item);
                    }).catch((err)=>{
                        console.log("fail to insert data", item);
                        resExec(false, item);
                    });
                }else{
                    db.collection("messages").updateOne({_id:item._id}, {$set:{stat:item.stat}}).then((res)=>{
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

module.exports=Requests;