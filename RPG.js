//functions
var FS = FileStream;
var parse = JSON.parse;
var ify = JSON.stringify;
//Game Data
var TodayDate;
var YesterDate;
var Hk = {};
var Maps = [];
var UserData = {};
//Script Data
var ScriptData = {
    Help : "",
    MoveHelp : "",
    Room_Name : "",
    admin : [],
    profile : [],
    path : "/sdcard/RPG/",
    Start : false
}
function response(room, msg, sender, isGroupChat, replier, imageDB) {
    if(room != ScriptData.Room_Name) return;
    //Start
    if(!ScriptData.Start) {
        Hk = parse(FS.read(Scriptdata.path + "Hotkey/Hotkey.json"));
        Maps = parse(FS.read(Scriptdata.path + "Maps/Map.json"));
        UserData = parse(FS.read(Scriptdata.path + "Data/UserData.json"));
        ScriptData.Start = true;
        ScriptData.Help = FS.read(Scriptdata.path + "/Help/Help.txt");
        ScriptData.MoveHelp = FS.read(Scriptdata.path + "/Help/MoveHelp.txt");
        TodayDate = nowTime().split(" ")[0];
        YesterDate = nowTime(Date.now() - 86400000).split(" ")[0];
    }
    //날짜변경
    if(nowTime.split(" ")[0] != TodayDate) {
        YesterDate = TodayDate;
        TodayDate = nowTime.split(" ")[0];
        FS.write(ScriptData.path + "Backup/Main_" + YesterDate + ".json", ify(UserData));
    }
    if(msg.startsWith("eva ")&&isAdmin(sender, imageDB.getprofileSHA)) {
        try {
            v = Date.now();
            ev = eval(msg.substr(4));
            replier.reply(ev);
            replier.reply(Date.now() - v);
        } catch (e) {
            replier.reply(e);
        }
    }
    for(i = 0; i < Hk.length; i++) {
        if(Hk[i].name == sender&&msg.indexOf(Hk[i].Hotkey[0])) {
            msg = msg.replace(Hk[i].Hotkey[0], Hk[i].Hotkey[1]);
        }
    }
    if(msg == "/도움말") {
        replier.reply(ScriptData.Help);
    }
    if(msg.startsWith("/단축키 ")) {
        var v = msg.substr(5).split(",");
        var v1 = v[0].trim();
        var v2 = v[1].trim();
        Hk.push({name : sender, Hotkey : [v1, v2]});
    }
    if(msg == "/백업"&&isAdmin(sender, imageDB.getprofileSHA)) {
        t = nowTime(Date.now());
        FS.write(Scriptdata.path + "Backup/" + t + ".json", ify(UserData));
        FS.write(Scriptdata.path + "Data/UserData.json", ify(UserData));
    }
    if(msg == "/이동") {
        replier.reply(ScriptData.MoveHelp);
    }
    if(msg.startsWith("/이동 ")) {
        
    }
    //end of response
}
//function
function isAdmin(sdr, prf) {
    if(ScriptData.admin.indexOf(sdr)&&ScriptData.profile[sdr] == java.lang.String(prf).hashCode) {
        return true;
    }
    return false;
}
function nowTime(time) {
    if(!time) {
        var day = new Date(val);
        var day1 = day.getFullYear() + "-" + (day.getMonth()+1) + "-" + day.getDate()+" "+day.getHours()+":"+day.getMinutes()+";"+day.getSeconds();
        return day1;
    } else {
        var day = new Date();
        var day1 = day.getFullYear() + "-" + (day.getMonth()+1) + "-" + day.getDate()+" "+day.getHours()+":"+day.getMinutes()+";"+day.getSeconds();
        return day1;
    }
}