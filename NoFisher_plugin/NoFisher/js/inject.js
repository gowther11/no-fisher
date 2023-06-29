//注入页面的js
var menu_opened = false
var mouseX = 0
var mouseY = 0

menuId = "menuDiv"
blockId = "blockDiv"
isSelect = false
selectType = "thread"

var currentThread;

function createQuickMenu(){
    var menuCSS = document.createElement("style");
    reqMenuCSS(function(css){
        menuCSS.innerHTML = css
    })
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(menuCSS)

    var menuHTML = document.createElement("div");
    //menuHTML.appendChild()
    menuHTML.id = menuId;
    menuHTML.className = "menu";
    document.body.appendChild(menuHTML);
    menuHTML.setAttribute("isselect", isSelect ? '1' : '0')
    reqMenuHTML(function(html){
        menuHTML.innerHTML = html
        var ul = menuHTML.firstElementChild
        var list = ul.querySelectorAll('li');
        for (var i = 0; i < list.length; i++){
            list[i].addEventListener("click", function(e){
                var index = Array.prototype.indexOf.call(list, e.target)
                if (index == -1){
                    index = Array.prototype.indexOf.call(list, e.target.parentNode)
                }
                if (index == -1){
                    index = Array.prototype.indexOf.call(list, e.target.parentNode.parentNode)
                }
                if (index == -1){
                    index = Array.prototype.indexOf.call(list, e.target.parentNode.parentNode.parentNode)
                }
                clickMenu(index);
            },false)
        }
    })
    menuHTML.style.cssText = "display:none"

    //创建屏幕的阻挡
    var block = document.createElement("div");
    block.id = blockId
    block.style.height = "20px"
    block.style.width = "50px"
    block.style.left = 0
    block.style.top = 0
    block.style.background = "white"
    block.style.color = "black"
    block.style.border = "2px solid blue"
    block.style.position = "fixed"
    block.style.display = "none"
    block.style.zIndex = 99999
    document.body.appendChild(block);
}

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
        createQuickMenu() //创建快捷菜单
        self.setInterval("CheckForFresh()", 100) //开启li检测
        loadOver()
    }
}
var interVal = self.setInterval("waitForNewList()", 100)

var count = 0
//检测li数量变化
function CheckForFresh(){
    var curCount = document.getElementById("new_list").childElementCount
    if (curCount != count){
        count = curCount
        //console.log("freshed!")
        reqSettings(updateShield)
    }
}

//获取元素在页面里的位置和宽高
function getScroll() {
    return {
        sLeft: document["documentElement"].scrollLeft + document["body"].scrollLeft,
        sTop: document["documentElement"].scrollTop + document["body"].scrollTop
    };
};

function getOffset(a) {
    var b = a.offsetLeft, top = a.offsetTop, current = a.offsetParent;
    while (current != null) {
        b += current.offsetLeft;
        top += current.offsetTop;
        current = current.offsetParent;
    }
    return { x: b, y: top, w : a.offsetWidth, h : a.offsetHeight};
};

function onMouseOver(){
    return "if(document.getElementById('" + menuId +"').getAttribute('isselect') == '1'){" +
        "this.style.border = '2px solid red';"  +
        "document.getElementById('" + menuId +"').setAttribute('selectid', this.getAttribute('data-thread-id'));"  +
    "}"
}

function onMouseOut(){
    return "this.style.border='none';"  +
    "if (document.getElementById('" + menuId +"').getAttribute('isselect') == '1'){"  +
        "document.getElementById('" + menuId +"').setAttribute('selectid', '');"  +
    "}"
}



//更新页面屏蔽信息
function updateShield(settings){
    //console.log(settings)
    var alllis = document.getElementById("new_list").children

    for(var i = 0; i < count; i++){
        var item = alllis[i]
        item.setAttribute("onmouseover", onMouseOver())
        item.setAttribute("onmouseout", onMouseOut())
        if (item.firstElementChild && item.firstElementChild.childElementCount > 0){
            var thread = item.getAttribute("data-thread-id")

            var tiebaAndtitle = item.firstElementChild.firstElementChild

            var tieba = item.firstElementChild.firstElementChild.children[0].firstElementChild.getAttribute("data-id")
            var tieba_name = item.firstElementChild.firstElementChild.children[0].firstElementChild.getAttribute("title")

            var title = item.firstElementChild.firstElementChild.children[1].firstElementChild.getAttribute("title")

            var content = item.firstElementChild.children[1].innerHTML

            var user = item.firstElementChild.lastElementChild.firstElementChild.getAttribute("href")
            var user_name = item.firstElementChild.lastElementChild.firstElementChild.innerHTML

            var params = {
                thread:thread,
                title:title,
                user:user,
                user_name:user_name,
                tieba:tieba,
                tieba_name:tieba_name,
                content:content,
            }

            if (isSelect && ! menu_opened){
                if (thread == document.getElementById(menuId).getAttribute('selectid')){
                    //console.log("aaaa")
                    currentThread = params
                    item.addEventListener('click', function() { reqShieldOne() }, false);
                }else{
                    item.addEventListener('click', function() {}, false);
                }
            }else{
                item.addEventListener('click', function() {}, false);
            }

            //console.log(params)

            reqShieldInfo(params, item, settings)

            //自动屏蔽
            // if (tieba == "17019292"){
            //     if (settings.autoShield == 1){
            //         //console.log(item.style.cssText)
            //         shieldOneItem(item, settings.autoStyle, settings.autoLevel)
            //         //console.log(item.style.cssText)
            //     }else{
            //         clearShield(item)
            //     }
            // }
            //手动屏蔽
        }
    }
    document.getElementById("openShield").innerHTML = settings.autoShield == 1 ? "关闭自动" : "开启自动"
    document.getElementById(blockId).innerHTML = settings.shieldType == 1 ? "屏蔽贴子" : settings.shieldType == 2 ? "屏蔽用户" : "屏蔽贴吧"
}

function UpdateBlock(){
    var block = document.getElementById(blockId)
    block.style.display = isSelect ? "block" : "none"
    if (isSelect){
        block.style.left = (mouseX + 10) + "px"
        block.style.top = (mouseY + 10) + "px"
    }
    if (isSelect && !menu_opened){
        console.log(currentThread)
        if (! currentThread || currentThread.thread != document.getElementById(menuId).getAttribute('selectid')){
            //console.log(currentThread, "yyy")
            reqSettings(updateShield)
        }
    }
}

//屏蔽某个元素
function shieldOneItem(item, style, level){
    //clearShield(item)
    clearShield(item)
    //console.log(style)
    switch (style){
      case 1:
          item.style.cssText = "display:none; text-decoration: none; background: none; opacity: none;";
          break;
      case 2:
          item.style.cssText = "display: block; text-decoration: line-through; background: none; opacity: none;";
          setStyleAll(item, "text-decoration:line-through")
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
    setStyleAll(item, "text-decoration:none")
}

function setStyleAll(item, txt){
    item.style.cssText = txt
    if (item.childElementCount > 0){
        for (var i = 0; i < item.childElementCount; i++){
            setStyleAll(item.children[i], txt)
        }
    }
}

// chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
//     console.log(response.farewell);
//   });

//请求查询屏蔽
function reqShieldInfo(params, item, settings){
    chrome.extension.sendMessage({action:"query shield", params:params}, function(response){
        if (response && response.result){
            if (response.isShield){
                shieldOneItem(item, settings.autoStyle, settings.autoLevel)
            }else{
                clearShield(item)
            }
        }
    })
}

//请求手动屏蔽
function reqShieldOne(){
    console.log(currentThread)
    chrome.extension.sendMessage({action:"shield one", params:currentThread}, function(response){
        if (response && response.result){
            if (response.result){
                console.log("result")
                reqSettings(updateShield)
            }
        }
    })
}

//请求设置，成功执行回调
function reqSettings(callback){
    chrome.extension.sendMessage({action:"get settings"}, function(response){
        if (response && response.result){
            callback(response.settings)
        }
    })
}

//请求menuHTML
function reqMenuHTML(callback){
    chrome.extension.sendMessage({action:"get menuHTML"}, function(response){
        if (response && response.result){
            callback(response.menuHTML)
        }
    })
}

//请求menuCSS
function reqMenuCSS(callback){
    chrome.extension.sendMessage({action:"get menuCSS"}, function(response){
        if (response && response.result){
            callback(response.menuCSS)
        }
    })
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch (request.action){
        case "update":
            reqSettings(updateShield)
            sendResponse({result:true})
            break;
        case "change type":
            selectType = request.selectType
            typeChange()
            sendResponse({result:true})
            break;


        default:
            console.log("Unknown action "+ request.action + " from " + sender)
            sendResponse({result:false})
            break;
    }

});

function recordMousePos(evt){
    evt = (evt) ? evt : window.event
    if (evt.clientX) {
        mouseX = evt.clientX
    }
    if (evt.clientY) {
        mouseY = evt.clientY
    }
    UpdateBlock()
}

window.document.onkeydown = openMenu;
function openMenu(evt){
    evt = (evt) ? evt : window.event
    if (evt.keyCode) {
        if(evt.keyCode == 17){
            var menu = document.getElementById(menuId)
            var style = "left:" +  (mouseX - 150) + "px; top:" + (mouseY - 150) + "px;"
            menu.style.cssText = menu_opened ?  "display:none;" : style + "display:block;"
            menu_opened = ! menu_opened
        }
    }
}

function closeMenu(){
    var menu = document.getElementById(menuId)
    menu.style.cssText = "display:none;"
    menu_opened = false
}

function selectClicked(){
    isSelect = !isSelect
    var menu = document.getElementById(menuId)
    menu.setAttribute("isselect", isSelect ? '1' : '0')
}

function typeChange(){
    var menu = document.getElementById(menuId)
    menu.setAttribute("selecttype", selectType)
}

//点击菜单
function clickMenu(i){
    closeMenu()
    chrome.extension.sendMessage({action : "menu" + i}, function(response){
        if (response && response.result){
            //console.log(response.index)
            switch(parseInt(response.index)){
                case 0:
                    reqSettings(updateShield)
                    break;

                case 4:
                    //alert("渔夫去质器已关闭!")
                    break;
                case 5:
                    selectClicked()
                    break;



                default:
                    break;
            }
        }
    })

}

function loadOver(){
    window.document.onmousemove = recordMousePos;
}