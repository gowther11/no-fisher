
var storage_local
var thread_storage
function reqData(callback){
    chrome.extension.sendMessage({action : "queryAll"}, function(response){
        if (response && response.result){
            callback(response.data)
        }
    })
}

function queryRecord(){
    console.log("queryRecord")
    reqData(function(data){
        console.log(data)
        data = JSON.parse(data)
        storage_local = data.autoRecord
        thread_storage = data.threadRecord
        for(var post in storage_local){

            queryPrint(storage_local[post],post)
        }

        for(var post_thread in thread_storage){

            queryPrint_thread(thread_storage[post_thread], storage_local.length + post_thread)
        }

        var count = storage_local.length + thread_storage.length
        while(document.getElementById(count)){
            document.getElementById(count).style.display = 'none'
        }

        //
        //queryPrint()
        //queryPrint_thread()
        })
    
    
}
//输出自动屏蔽记录到popup.html
function queryPrint(post,index){
    var txt = "";
    var y;

    if(document.getElementById(index)){                                 //已存在的记录刷新内容
        for( y in post){ 
            txt += post[y] + " ";
        } 
        txt = "自动  " + txt
        document.getElementById(index).innerHTML = txt;
        document.getElementById(index).style.display = 'block'
    }
    else{
        var datahtml = document.createElement("div");
        datahtml.id = index;
        document.body.appendChild(datahtml);
        
        // var single_del = document.createElement("button");           //新建屏蔽记录
        // single_del.innerText = index;
        // single_del.onclick = single_delete;

        for( y in post){ 
            txt += post[y] + " ";
        } 
        txt = "自动  " + txt
        //console.log(txt)
        datahtml.innerHTML = txt;
    }
    
}
//输出手动屏蔽记录到popup.html
function queryPrint_thread(post,index){
    var txt = "";
    var y;

    if(document.getElementById(index)){
        for( y in post){ 
            txt += post[y] + " ";
        } 
        txt = "手动  " + txt
        document.getElementById(index).innerHTML = txt;
        document.getElementById(index).style.display = 'block'
    }
    else{
        var datahtml = document.createElement("div");
        datahtml.id = index;
        document.body.appendChild(datahtml);
        
        // var single_del = document.createElement("button");
        // single_del.innerText = index;
        // single_del.onclick = single_delete;

        for( y in post){ 
            txt += post[y] + " ";
        } 
        txt = "手动  " + txt
        console.log(txt)
        datahtml.innerHTML = txt;
    }
    
}
// function single_delete(index){

// }
function query_clear_thread(){                               //清除记录
    var deleteb = document.createElement("button");
    deleteb.innerText="删除手动屏蔽记录";
    deleteb.onclick = function(){
        reqDeleteRecord("threadRecord")
        queryRecord()
    }
    
    document.body.appendChild(deleteb);
}

function reqDeleteRecord(params){
    chrome.extension.sendMessage({action:"clear storage", params:params}, function(response){
        if (response && response.result){
            //console.log('yyyy')
            queryRecord()
        }
    })
}


function refresh(){
    queryRecord()
    var refresh = document.createElement("button");
    refresh.innerText="刷新";
    refresh.onclick = queryRecord;
    
    document.body.appendChild(refresh);
}
// self.setInterval("queryRecord()", 100)

self.refresh();
self.query_clear_thread();

