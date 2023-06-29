//注入页面的js
var time = 0
//等待newlist加载完成
function waitForNewList(){
    if (time > 10000){
        alert('error:加载超时！')
        self.clearInterval(interVal)
    }
    time = time + 100
    if (document.getElementById("new_list")){
        console.log("newlist加载完成")
        self.clearInterval(interVal)
        self.setInterval("CheckForFresh()", 100) //开启li检测
    }
}
var interVal = self.setInterval("waitForNewList()", 100)

var count = 0
//检测li数量变化
function CheckForFresh(){
    var curCount = document.getElementById("new_list").childElementCount
    if (curCount != count){
        count = curCount
        console.log("freshed!")
        reqSettings(updateShield)
    }
}

//更新页面屏蔽信息
function updateShield(settings){
    console.log(settings)
    var alllis = document.getElementById("new_list").children

    for(var i = 0; i < count; i++){
        var item = alllis[i]
        if (item.firstElementChild && item.firstElementChild.firstElementChild){
            var tieba = item.firstElementChild.firstElementChild.firstElementChild
            var tieba_id = tieba.firstElementChild.getAttribute("data-id")
            //自动屏蔽
            if (tieba_id == "17019292"){
                if (settings.autoShield == 1){
                    //console.log(item.style.cssText)
                    shieldOneItem(item, settings.autoStyle, settings.autoLevel)
                    //console.log(item.style.cssText)
                }else{
                    clearShield(item)
                }
            }
            //手动屏蔽
        }
    }
}

//屏蔽某个元素
function shieldOneItem(item, style, level){
    //clearShield(item)
    clearShield(item)
    console.log(style)
    switch (style){
      case 1:
          item.style.cssText = "display:none; text-decoration: none; background: none; opacity: none;";
          break;
      case 2:
          item.style.cssText = "display: block; text-decoration: line-through; background: none; opacity: none;";
          console.log(item.childElementCount)
          if (item.childElementCount > 0){
            for (var i = 0; i < item.childElementCount; i++){
                shieldOneItem(item.children[i], style, level)
            }
          }
          break;
      case 3:
            item.style.cssText = "display: block; text-decoration: none; background: grey; opacity: 0.7;";
          break;
      case 4:
            item.style.cssText = "display: block; text-decoration: none; background: none; opacity: 0.3;";
            break;
      default:
          console.log("style 越界")
          break;
    }
  }

//清除屏蔽效果
function clearShield(item){
    item.style.cssText = "";
    if (item.childElementCount > 0){
        for (var i = 0; i < item.childElementCount; i++){
            clearShield(item.children[i])
        }
    }
}

// chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
//     console.log(response.farewell);
//   });

//请求设置，成功执行回调
function reqSettings(callback){
    chrome.extension.sendMessage({action:"get settings"}, function(response){
        if (response && response.result){
            callback(response.settings)
        }
    })
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch (request.action){
        case "update":
            reqSettings(updateShield)
            sendResponse({result:true})
            break;

        default:
            console.log("Unknown action "+ request.action + " from " + sender)
            sendResponse({result:false})
            break;
    }

});