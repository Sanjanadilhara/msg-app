const {MongoClient,  ObjectId}  = require('mongodb');



class Requests{
    static REQ_ACCEPT_RESPOND_SENT=3
    static REQ_ACCEPTED=2;
    static REQ_SENT=1
    static REQ_RECORDED=0;

    constructor(){
        this.requests=[];
      
    }
    prepareToSend(item){
        return {type:"request", to:item.to ,from:item.from.toString(), date:item.date};
    }
    prepareAccept(item){
        return {type:"request", accept:1, to:item.to, from:item.from.toString(), date:item.date};
    }
    prepareAcceptRespond(item){
        return {type:"requestAcceptRespose", accept:1, to:item.to, from:item.from.toString(), date:item.date, reqId:item.reqId};
    }
    prepareSendRespose(item){
        return {type:"requestResponse", to:item.to.toString, stat:item.stat, reqId:item.reqId};
    }

    addRequest(obj){
        let temReq=new Object();

        let temkeys=['from', 'to', '_id', 'stat', 'date', 'reqId'];
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


    retriveRequests(qry, execUpdated, execAllUpdated){
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
            if(item?.from!=undefined && item?.to != undefined && item?.reqId != undefined ){
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
                    db.collection("requests").updateOne({_id:item._id}, {$set:{stat:item.stat}}).then((res)=>{
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