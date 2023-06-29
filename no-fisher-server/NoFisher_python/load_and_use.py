from transformers import BertConfig, BertForSequenceClassification
from transformers import BertTokenizer
import torch
# import urllib3.contrib.pyopenssl

# urllib3.contrib.pyopenssl.inject_into_urllib3()
tokenizer = BertTokenizer("D:/1/no-fisher-master/NoFisher_python/learning/vocab.txt")

model = BertForSequenceClassification.from_pretrained("D:/1/no-fisher-master/NoFisher_python/learning")

def judge(text):
    inputs = tokenizer(text, return_tensors="pt")
    data = model(**inputs).logits.data
    t = torch.softmax(data,dim=1)
    if t[0][0]>=t[0][1]:
        return 0  #not fishing 不屏蔽
    else:
        return 1  #fishing 屏蔽
print(judge("2021年快过去了，老规矩，一人发一张本年度最有意义的照片吧。"))