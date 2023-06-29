//用户设置
var settings = {
    pluginOn:true,
    autoStyle:0,
    autoLevel:0,
    autoShield: false,
    join:false,
    shieldType:0,
}

//不屏蔽记录
var notShield = [] //[]
//自动屏蔽记录
var autoRecord = [] //id title content
//屏蔽用户
var userRecord = [] //id name
//屏蔽贴吧
var tiebaRecord = [] //id name
//屏蔽帖子
var threadRecord = [] //id title content

//快捷菜单的html
var menuHTML = ""
var menuCSS = ""

//监听消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    switch (request.action){
        case "get settings":
            //console.log("获取当前配置")
            sendResponse({result : true, settings : settings})
            break;
        case "get menuHTML":
            //console.log("获取menu的html")
            sendResponse({result : true, menuHTML : menuHTML})
            break;
        case "get menuCSS":
            //console.log("获取menu的CSS")
            sendResponse({result : true, menuCSS : menuCSS})
            break;
        case "menu0":
            //console.log("开启屏蔽")
            settings.autoShield = settings.autoShield == 1 ? 0 : 1
            sendResponse({result : true, index : request.action.charAt(request.action.length - 1)})
            break;
        case "menu1":
            //console.log("用户")
            //
            window.open("http://127.0.0.1:8000/login-form/","_blank")
            sendResponse({result : true, index : request.action.charAt(request.action.length - 1)})
            break;   
        case "menu2":
            //console.log("关闭轮盘")
            sendResponse({result : true, index : request.action.charAt(request.action.length - 1)})
            break;
        case "menu3":
            //console.log("记录")
            window.open("chrome-extension://gbgkfohfnogkjadgkfbpmlinfchmdpod/popup.html")
            //console.log(localStorage.getItem("settings"))
            sendResponse({result : true, index : request.action.charAt(request.action.length - 1)})
            break;
        case "menu4":
            //console.log("关闭插件")
            //chrome.extension.remove('')
            sendResponse({result : true, index : request.action.charAt(request.action.length - 1)})
            break;
        case "menu5":
            //console.log("屏蔽")
            //chrome.contextMenus.open()
            sendResponse({result : true, index : request.action.charAt(request.action.length - 1)})
            break;
        case "menu6":
            //console.log("中心")
            sendResponse({result : true, index : request.action.charAt(request.action.length - 1)})
            break;
        case "query shield":
            //console.log("请求查询屏蔽详情")
            if (request.params){
                queryShield(request.params.thread, request.params.title, request.params.user, request.params.tieba, request.params.content)
                sendResponse({result : true, isShield : queryShield(request.params.thread, request.params.user, request.params.tieba, request.params.content)})
            }
            break;
        case "queryAll":
            //console.log("查询所有记录")
            sendResponse({result:true, data:localStorage.getItem("settings")})
            break
        case "shield one":
            if (request.params){
                if (!isContains(threadRecord, request.params.thread)){
                    threadRecord.push({id : request.params.thread, title : request.params.title, content : request.params.content, type:settings.shieldType})
                }
                console.log(settings.shieldType)
                switch(settings.shieldType){
                    case 1:
                        //threadRecord.push(request.params.thread)
                        break;
                    case 3:
                        if (!isContains(tiebaRecord, request.params.tieba)){
                            tiebaRecord.push({id:request.params.tieba, name:request.params.tieba_name})
                        }
                        break;

                    case 2:
                        if (!isContains(userRecord, request.params.user)){
                            userRecord.push({id:request.params.user, name:request.params.user_name})
                        }
                        break;
                    default:
                        break;
                }
                sendResponse({result : true, isShield : queryShield(request.params.thread, request.params.user, request.params.tieba, request.params.content)})
            }
            break;
        case "clear storage":
            if (request.params){
                clearStorgae(request.params)
                sendResponse({result : true})
            }
            break;



        default:
            console.log("Unknown action "+ request.action + " from " + sender)
            sendResponse({result : false})
            break;
    }
});

//获取menu的html
var xmlhttp;
xmlhttp = new XMLHttpRequest();
xmlhttp.onload = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        menuHTML = xmlhttp.responseText;
    }
}
xmlhttp.open("GET", "menu.html", true);
xmlhttp.send();

var csshttp;
csshttp = new XMLHttpRequest();
csshttp.onload = function() {
    if (csshttp.readyState == 4 && csshttp.status == 200) {
        menuCSS = csshttp.responseText;
        //console.log(menuCSS)
    }
}
csshttp.open("GET", "css/menu.css", true);
csshttp.send();


function queryShield(thread, title, user, tieba, content){
    for (var i = 0; i < notShield.length; i++){ //是否是不屏蔽
        if (notShield[i] == thread){
            return false
        }
    }
    if (settings.autoShield){
        for (var j = 0; j < autoRecord.length; j++){ //是否是自动屏蔽
            if (autoRecord[j].id == thread){
                return true
            }
        }
    }
    for (var k = 0; k < threadRecord.length; k++){ //是否是手动屏蔽
        if (threadRecord[k].id == thread){
            return true
        }
    }

    for (var m = 0; m < userRecord.length; m++){
        if (userRecord[m].id == user){
            if (!isContains(threadRecord, thread)){
                threadRecord.push({id : thread, title : title, content : content, userid : user,  tiebaid : tieba})
                saveSettings()
            }
            return true
        }
    }

    for (var n = 0; n < tiebaRecord.length; n++){
        if (tiebaRecord[n].id == tieba){
            if (!isContains(threadRecord, thread)){
                threadRecord.push({id : thread, title : title, content : content, userid : user,  tiebaid : tieba})
                saveSettings()
            }
            return true
        }
    }

    if (content && content.length < 15){ //模拟判断自动屏蔽
        if (!isContains(autoRecord, thread)){
            autoRecord.push({id : thread, title : title,  content:content})
            saveSettings()
        }
        //console.log("yyyy")
        //console.log(content)
        if (settings.autoShield){
            return true
        }
    }

    return false
}

function isContains(list, id){
    for (var i = 0; i < list.length; i++){
        if (list[i].id == id){
            return true
        }
    }
    return false
}

//请求更新,成功执行回调
function reqUpdate(callback){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {action: "update"}, function(response) {
            //console.log(response)
            if (response && response.result){
                //更新成功
                callback()
            }
        });  
    });
}

function shieldByKeyworld(params){
    chrome.tabs.create({url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(params.selectionText)});
}

function clickSettings(params){
    //todo:保存配置
    //console.log(params);
    var type = params.menuItemId[3];
    var index = params.menuItemId[4];
    var action = ""
    if (type == 1){
        //手动屏蔽偏好
        settings.shieldType = parseInt(index)
        saveSettings()
    }
    if (type == 4) {
        //alert("屏蔽方式" + index)
        settings.autoStyle = parseInt(index)
        reqUpdate(saveSettings)
    }
    if (type == 5) {
        //alert("屏蔽等级" + index)
        settings.autoLevel = parseInt(index)
        reqUpdate(saveSettings)
    }
}

//保存配置
function saveSettings(){
    //console.log("save settings")
    let data = {
        settings : settings,
        autoRecord : autoRecord,
        userRecord : userRecord,
        tiebaRecord : tiebaRecord,
        threadRecord : threadRecord
    }

    var content = JSON.stringify(data);
    localStorage.setItem("settings",content)
}

function clickOpen(params){
    settings.autoShield = params.checked ? 1 : 0
    reqUpdate(saveSettings)
}

function clearStorgae(type){
    switch (type){
        case "autoRecord":
            while(autoRecord.length){
                autoRecord.pop()
            }
            break;
        case "userRecord":
            while(userRecord.length){
                userRecord.pop()
            }
             break;
        case "tiebaRecord":
            while(tiebaRecord.length){
                tiebaRecord.pop()
            }
            break;
        case "threadRecord":
            while(threadRecord.length){
                threadRecord.pop()
            }
            break;
        case "all":
            while(autoRecord.length){
                autoRecord.pop()
            }
            while(userRecord.length){
                userRecord.pop()
            }
            while(tiebaRecord.length){
                tiebaRecord.pop()
            }
            while(threadRecord.length){
                threadRecord.pop()
            }
            break;

        case "notShield":
            notShield = []
            break;
    }
    saveSettings()
    reqUpdate(saveSettings)
}


function createMenu()  {
    var menu = {
        "menus": [
          {"id": "main", "visible": true, "title": "渔夫去质器"},
          {"id": "sub1", "visible": true, "title": "手动屏蔽偏好", "parentId": "main"},
          {"type": "separator", "visible": true, "parentId": "main"},
          {"id": "sub4", "visible": true, "title": "屏蔽方式偏好", "parentId": "main"},
          {"id": "sub5", "visible": true, "title": "屏蔽等级偏好", "parentId": "main"},
          {"type":"checkbox", "id": "sub6", "visible": true, "title": "开启自动屏蔽", "parentId": "main", "checked":settings.autoShield == 1, "onclick" : clickOpen},
          {"id": "sub7", "visible": true, "title": "屏蔽记录", "parentId": "main", "onclick" : function(){window.open("chrome-extension://gbgkfohfnogkjadgkfbpmlinfchmdpod/popup.html")}},
          {"type": "separator", "visible": true, "parentId": "main"},
          {"id": "sub8", "visible": true, "title": "用户体验计划", "parentId": "main"},
          {"id": "sub9", "visible": true, "title": "关闭渔夫去质器", "parentId": "main"},
    
          {"type":"radio", "id": "sub11", "visible": true, "title": "根据帖子屏蔽", "parentId": "sub1", "checked":settings.shieldType == 1, "onclick" : clickSettings},
          {"type":"radio", "id": "sub12", "visible": true, "title": "根据用户屏蔽", "parentId": "sub1", "checked":settings.shieldType == 2, "onclick" : clickSettings},
          {"type":"radio", "id": "sub13", "visible": true, "title": "根据贴吧屏蔽", "parentId": "sub1", "checked":settings.shieldType == 3, "onclick" : clickSettings},

          {"type":"radio", "id": "sub41", "visible": true, "title": "消失", "parentId": "sub4", "checked":settings.autoStyle == 1, "onclick" : clickSettings},
          {"type":"radio", "id": "sub42", "visible": true, "title": "划线", "parentId": "sub4", "checked":settings.autoStyle == 2, "onclick" : clickSettings},
          {"type":"radio", "id": "sub43", "visible": true, "title": "低亮", "parentId": "sub4", "checked":settings.autoStyle == 3, "onclick" : clickSettings},
          {"type":"radio", "id": "sub44", "visible": true, "title": "变淡", "parentId": "sub4", "checked":settings.autoStyle == 4, "onclick" : clickSettings},
    
          {"type":"radio", "id": "sub51", "visible": true, "title": "1", "parentId": "sub5", "checked":settings.autoLevel == 1, "onclick" : clickSettings},
          {"type":"radio", "id": "sub52", "visible": true, "title": "2", "parentId": "sub5", "checked":settings.autoLevel == 2, "onclick" : clickSettings},
          {"type":"radio", "id": "sub53", "visible": true, "title": "3", "parentId": "sub5", "checked":settings.autoLevel == 3, "onclick" : clickSettings},
          {"type":"radio", "id": "sub54", "visible": true, "title": "4", "parentId": "sub5", "checked":settings.autoLevel == 4, "onclick" : clickSettings},
          {"type":"radio", "id": "sub55", "visible": true, "title": "5", "parentId": "sub5", "checked":settings.autoLevel == 5, "onclick" : clickSettings},
        ]
      };
    menu.menus.forEach(value => {
        //console.log(value);
        chrome.contextMenus.create(value);
      
    })
};

function createMenusBySettings(){
    var storage = localStorage.getItem("settings")
    if (storage && storage != ""){
        console.log("use local storage settings")
        data = JSON.parse(storage)
        console.log(data)
        //console.log(data)
        settings = data.settings
        autoRecord = data.autoRecord
        userRecord = data.userRecord
        tiebaRecord = data.tiebaRecord
        threadRecord = data.threadRecord
        createMenu();
        saveSettings()
    }
    else{
        var url = "js/config/settings.json";
        var request = new XMLHttpRequest();
        request.open("get", url);/*设置请求方法与路径*/
        request.send(null);/*不发送数据到服务器*/
        request.onload = function () {/*XHR对象获取到返回信息后执行*/
            //console.log(request.status);
            if (request.status == 200) {/*返回状态为200，即为数据获取成功*/
                console.log("use default settings")
                var json = JSON.parse(request.responseText);
                settings = json.settings
                autoRecord = json.autoRecord
                userRecord = json.userRecord
                tiebaRecord = json.tiebaRecord
                threadRecord = json.threadRecord
                createMenu();
                saveSettings()
            }
        }
    }
}

createMenusBySettings();
