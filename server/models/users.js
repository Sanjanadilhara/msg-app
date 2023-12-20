const {MongoClient,  ObjectId}  = require('mongodb');



class Users{
    static MSG_SENT_AND_RESPONSE_SENT=2;
    static MSG_SENT_RESPOSE_NOT_SENT=1
    static MSG_RECORDED=0;

    constructor(){
        this.users=[];
      
    }

    prepareToSend(item){
        return {type:"message", message:item?.message, from:item?.from.toString(), date:item?.date};
    }
    prepareSendRespose(item){
        return {type:"msgRespose", to:item?.to.toString(), msgId:item?.msgId, sent:item?.sent};
    }

    addUser(obj){
        try{
            let temUser=new Object();

            let temkeys=['fname', 'lname', '_id', 'password', 'email', 'username'];
            for(const [key, value] of Object.entries(obj)){
                if(temkeys.includes(key)){
                    if((key=='_id' || key=='from' || key=='to') &&  typeof value == 'string'){
                            temUser[key]=new ObjectId(value); 
                        }
                        else{
                            temUser[key]=value;
                        }
                    }
                }
                this.users.push(temUser);
                return true;
        }catch(e){
            console.log("error log: users.js-> Users ->class ->addMessage()");
            return false;
        }
    }


    retriveusers(qry, execUpdated, execAllUpdated){
        qry.toArray().then((data)=>{
            data.forEach((item)=>{
                this.addUser(item);
                execUpdated(true, this.users[this.users.length-1]);
            });
            execAllUpdated(true);
        }).catch((res)=>{execAllUpdated(false);});
    

    }

    updateDataBase(db, resExec){
        this.users.forEach((item)=>{
            if(item?.password!=undefined && item?.email != undefined && item?.username != undefined){
                if(item?._id===undefined){
                    db.collection("users").insertOne(item).then((res)=>{
                        resExec(true, item);
                    }).catch((err)=>{
                        console.log("fail to insert data", item);
                        resExec(false, item);
                    });
                }else{
                    db.collection("users").updateOne({_id:item._id}, {$set:item}).then((res)=>{
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

module.exports=Users;