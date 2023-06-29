//用户设置
var settings = {
    pluginOn:true,
    autoStyle:0,
    autoLevel:0,
    autoShield: false,
    join:false,
}

//监听消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    switch (request.action){
        case "get settings":
            console.log("获取当前配置")
            sendResponse({result : true, settings : settings})
            break;
        



        default:
            console.log("Unknown action "+ request.action + " from " + sender)
            sendResponse({result : false})
            break;
    }
});

//请求更新,成功执行回调
function reqUpdate(callback){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {action: "update"}, function(response) {
            console.log(response)
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

function shieldByCard(){
    alert("屏蔽帖子");
}

function clickSettings(params){
    //todo:保存配置
    //console.log(params);
    var type = params.menuItemId[3];
    var index = params.menuItemId[4];
    var action = ""
    if (type == 4) {
        //alert("屏蔽方式" + index)
        settings.autoStyle = parseInt(index)
    }
    if (type == 5) {
        //alert("屏蔽等级" + index)
        settings.autoLevel = parseInt(index)
    }
    reqUpdate(saveSettings)
}

//保存配置
function saveSettings(){
    console.log("save settings")
}

function clickOpen(params){
    settings.autoShield = params.checked ? 1 : 0
    reqUpdate(saveSettings)
}

function createMenu(menu)  {
    menu.menus.forEach(value => {
        //console.log(value);
        chrome.contextMenus.create(value);
      
    })
};

function createMenusBySettings(){
    var url = "js/config/settings.json";
    var request = new XMLHttpRequest();
    request.open("get", url);/*设置请求方法与路径*/
    request.send(null);/*不发送数据到服务器*/
    request.onload = function () {/*XHR对象获取到返回信息后执行*/
        //console.log(request.status);
        if (request.status == 200) {/*返回状态为200，即为数据获取成功*/
            var json = JSON.parse(request.responseText);
            settings = json.settings
            var menu = {
                "menus": [
                  {"id": "main", "visible": true, "title": "渔夫去质器"},
                  {"id": "sub1", "visible": true, "title": "屏蔽当前帖子", "parentId": "main","onclick":shieldByCard},
                  {"id": "sub2", "visible": true, "title": "屏蔽当前用户", "parentId": "main"},
                  {"id": "sub3", "visible": true, "title": "取消屏蔽", "parentId": "main"},
                  {"type": "separator", "visible": true, "parentId": "main"},
                  {"id": "sub4", "visible": true, "title": "屏蔽方式偏好", "parentId": "main"},
                  {"id": "sub5", "visible": true, "title": "屏蔽等级偏好", "parentId": "main"},
                  {"type":"checkbox", "id": "sub6", "visible": true, "title": "开启屏蔽", "parentId": "main", "onclick" : clickOpen},
                  {"id": "sub7", "visible": true, "title": "屏蔽记录", "parentId": "main"},
                  {"type": "separator", "visible": true, "parentId": "main"},
                  {"id": "sub8", "visible": true, "title": "用户体验计划", "parentId": "main"},
                  {"id": "sub9", "visible": true, "title": "关闭渔夫去质器", "parentId": "main"},
            
                  {"type":"radio", "id": "sub41", "visible": true, "title": "消失", "parentId": "sub4", "checked":settings.style == 1, "onclick" : clickSettings},
                  {"type":"radio", "id": "sub42", "visible": true, "title": "划线", "parentId": "sub4", "checked":settings.style == 2, "onclick" : clickSettings},
                  {"type":"radio", "id": "sub43", "visible": true, "title": "低亮", "parentId": "sub4", "checked":settings.style == 3, "onclick" : clickSettings},
                  {"type":"radio", "id": "sub44", "visible": true, "title": "变淡", "parentId": "sub4", "checked":settings.style == 4, "onclick" : clickSettings},
            
                  {"type":"radio", "id": "sub51", "visible": true, "title": "1", "parentId": "sub5", "checked":settings.level == 1, "onclick" : clickSettings},
                  {"type":"radio", "id": "sub52", "visible": true, "title": "2", "parentId": "sub5", "checked":settings.level == 2, "onclick" : clickSettings},
                  {"type":"radio", "id": "sub53", "visible": true, "title": "3", "parentId": "sub5", "checked":settings.level == 3, "onclick" : clickSettings},
                  {"type":"radio", "id": "sub54", "visible": true, "title": "4", "parentId": "sub5", "checked":settings.level == 4, "onclick" : clickSettings},
                  {"type":"radio", "id": "sub55", "visible": true, "title": "5", "parentId": "sub5", "checked":settings.level == 5, "onclick" : clickSettings},
                ]
              };
              createMenu(menu);
        }
    }
}

createMenusBySettings();

// chrome.contextMenus.create({
// 	title: '屏蔽关键字: %s', // %s表示选中的文字
// 	contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
// 	onclick: function(params)
// 	{
// 		// 注意不能使用location.href，因为location是属于background的window对象
// 		chrome.tabs.create({url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(params.selectionText)});
// 	}
// });