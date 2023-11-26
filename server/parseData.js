const {MongoClient,  ObjectId}  = require('mongodb');


module.exports=function(dta){
    try{
        this.data=JSON.parse(dta);
        console.log("prse ok parsing");
        this.type=this.data.type;
        this.cookie=this.data.cookie;
        this.fail=false;
    }catch{
        console.log("fail tp parse "+dta);
        this.fail=true;
    }
}
module.exports.message=function(obj){
    console.log("msgparsing"+obj);
    if(obj.data?.message!=undefined && obj.data?.to!=undefined && obj.data?.msgId!=undefined ){
        this.message=obj.data.message;
        this.to=new ObjectId(obj.data.to);
        this.msgId=obj.data.msgId;
        this.fail=false;
    }
    else{
        this.fail=true;
    }
    
}
module.exports.request=function(obj){
    if(obj.data?.to!=undefined ){
        this.to=obj.data.to;
        this.fail=false;
    }
    else{
        this.fail=true;
    }
    
}
module.exports.reqAccept=function(obj){
    if(obj.data?.id!=undefined ){
        this.id=obj.data.id;
        this.fail=false;
    }
    else{
        this.fail=true;
    }
    
}