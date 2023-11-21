module.exports.parse=function(val){
    let cookies=val.split(";");
    let toret={};
    cookies.forEach(element => {
        let kpair=element.split("=");
        toret[kpair[0].trim()]=kpair[1];
    });

    return toret;
}