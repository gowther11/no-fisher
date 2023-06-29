import re
import urllib.request
import json
import time

# headers = {
# 'Accept': '*/*'
# 'Accept-Encoding': 'gzip, deflate, br'
# 'Accept-Language': 'zh-CN,zh;q=0.9'
# 'Connection': 'keep-alive'
# 'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"'
# 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
# }


link = "https://tieba.baidu.com/p/count?frwh=index"
re_title = r'core_title_txt(.*?)>(.*?)</'  #标题
re_firstFloor = r'j_p_postlist(.*?)data-field=(.*?)data-pid' #一楼回复

re_floorContent = r'id="post(.*?)>(.*?)</div>'
re_img = r'</?\w+[^>]*>'

re_uid = r'user_id":(.*?),'
re_uname = r'user_name":"(.*?)"'

def getAllli(url):
    response = urllib.request.urlopen(url)
    html = str(response.read(), encoding='utf-8').replace("&quot;", "\"").replace("\\", "").replace("<br>", "") #替换引号、转义符、换行符
    if not html:
        return None

    if html.find("百度安全验证"):
        print('安全验证页面')

    data_title = re.findall(re_title, html)
    data_filed = re.findall(re_firstFloor, html)
    data_content = re.findall(re_floorContent, html)
    title = data_title[0][1]

    field = data_filed[0][1]
    uid = re.findall(re_uid, field)[0]
    uname = re.findall(re_uname, field)[0]
    
    content = re.sub(re_img, "", data_content[0][1])
    return {'url' : url, 'uid' : uid, 'uname' : uname, 'title' : title, 'content' : content}


def getData(start, count, log = False):
    data = []
    start = 7677197468
    for i in range(count):
        print(i, " / ", count, "  ", i / count) #打印进度
        try:
            url = link.replace('count', str(start + i))
            if log:
                print(url)

            result = getAllli(url)
            if log:
                print(getAllli(url))

            data.append(result)
            time.sleep(0.5)  #防止被锁ip?
        except Exception as e:
            #print(str(e))
            pass


if __name__ == '__main__':
    #print(getData(7677197468, 100, True))
    getAllli("https://tieba.baidu.com/p/7677197468")
    