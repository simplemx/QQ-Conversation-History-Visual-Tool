# QQ Conversation History Visual Tool

QQ聊天记录可视化工具

## 要求环境

Python 2.6.4
Chrome 10+(暂时只支持chrome，其他并不能很好的显示)

## 使用方式

首先从QQ软件中获取聊天记录，导出为txt文本。

然后使用py目录下的解释脚本将聊天记录转换为JSON格式的JS脚本。
命令：python conversationUI.py。进入界面后选择选择导出的聊天记录txt文本，然后下一步，选择好双方各有过哪些名字，然后下一步即可生成JS脚本。

将生成的脚本拷贝到web/script/data目录下，此时即可从web下的index.html进行访问了。

具体参考example的内容。

## DEMO地址

http://simplemx.github.com/QQ-Conversation-History-Visual-Tool/
