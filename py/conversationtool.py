#! /usr/bin/env python
#coding=utf-8

import re
import codecs
import sys
import threading
import json
import math

class generateThread(threading.Thread):
    def __init__(self,myList,herList):
        threading.Thread.__init__(self)
        self.myList = myList
        self.herList = herList
    
    def run(self):
        generateJSON(self.myList,self.herList)
        
def generateJSON(myList , herList):
    for each in conversationList:
        if each["name"] in myList:
            each["side"] = "my"
        else:
            each["side"] = "her"
    count = len(conversationList)
    groupCount = int(math.ceil(count/1000.0))
    for x in xrange(groupCount):
        if x*1000>count:
            "the last iter"
            writeSubScript(conversationList[x*1000:],x+1)
        else:
            writeSubScript(conversationList[x*1000:(x+1)*1000],x+1)
    writeMainScript(groupCount)  
    
def writeMainScript(count):
    "write the main js data.js to set the loadDataList"
    arr = ["""
    (function(context){
        context = context && window;
        var loadDataList = ["""
    ]
    arr.extend([getSubScriptName(x,count) for x in xrange(count)])
    arr.append("""];
        context.beginLoad && context.beginLoad(loadDataList);
    })(window)
    """
    )
    scriptContent = "".join(arr)
    f = codecs.open("d:\\data.js","w","utf-8")
    try:
        f.write("".join([codecs.BOM_UTF8, scriptContent]))
    finally:
        f.close()
    
def getSubScriptName(index,count):
    suffix = ","
    if(index == count-1):
        suffix=""
    return "".join(["\"data",str(index+1),".js\"",suffix])
    
def writeSubScript(dataList,index):
    f = codecs.open("".join(["d:\\data",str(index),".js"]),"w","utf-8")
    try:
        content = json.dumps(dataList,ensure_ascii=False)
        before = """
            (function(context){
            context = context && window;
            context.conversationData ="""
        after = ";context.onLoadData && context.onLoadData(conversationData);})(window);"
        f.write("".join([codecs.BOM_UTF8,  before,content,after]))
    finally:
        f.close()

class readThread(threading.Thread):
    def __init__(self,tk,filePath):
        threading.Thread.__init__(self)
        self.tk = tk
        self.filePath = filePath
    
    def run(self):
        readFile(self.filePath)
        self.tk.names = [nameMap[key] for key in nameMap.keys()]
        

pattern = re.compile(r'\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}:\d{2}:\d{2}\s')
nameMap = {}
## maximum size of a python list on a 32 bit system is 536,870,912 elements.so it couldn't be so many conversation.
##if it exists,you don't need this tool just tell her that you miss her every moment of your life
conversationList = []

def readFile(path):
    f = codecs.open(path,"r","utf-8")
    try:
        conversation = []
        userName = None
        date = None
        for each in f.readlines():
            m = pattern.match(each)
            if m and m.end() > 0:
                if len(conversation) > 0 and userName and userName != ' ':
                    #find another name,the name before and the content between them is the conversation
                    conversationList.append({"name":userName,"content":"".join(conversation),"date":date})
                userName = each[m.end():]
                if userName[-2:] == "\r\n":
                    userName = userName[:-2]
                if userName != ' ' and userName not in nameMap:
                    nameMap[userName] = userName
                conversation = []
                if userName != ' ':
                    date = each[:m.end()-1]
            else:
                #add the name and content to the conversationList 
                #when find a name,all the stuff between the name and another name is the conversation content
                if each != "\r\n":
                    conversation.append(each)
        if len(conversation) > 0 and userName and userName != ' ':
            conversationList.append({"name":userName,"content":"".join(conversation),"date":date})
    finally:
        f.close()
    return nameMap,conversationList

if __name__ == "__main__":
    reload(sys)
    sys.setdefaultencoding("utf-8")
    readFile("D:\\conversation.txt")
    generateJSON([],[])