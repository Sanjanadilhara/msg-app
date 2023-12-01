module.exports=function(dta){
    let data;
    try{
        data=JSON.parse(dta);
        console.log("prse ok parsing");
        if(data.type===undefined && data.cookie===undefined){
            return null;
        }
    }catch{
        return null;
    }
    return data;
}