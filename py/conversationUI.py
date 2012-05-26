#! /usr/bin/env python
#coding=utf-8

from Tkinter import Tk, Frame,Label,BOTH, Listbox, StringVar, END, Button
import tkMessageBox as box
import tkFileDialog as fileDialog
import sys
import conversationtool

class WaitingUI(Frame):
    def __init__(self,parent,filePath):
        Frame.__init__(self,parent)
        self.parent = parent
        self.names = None
        self.filePath = filePath
        self.initUI()
        self.centerWindow()
        self.readFile()
    
    def onReadFinish(self):
        self.parent.destroy()
        chooseName(self.names)
    
    def readFile(self):
        t = conversationtool.readThread(self,self.filePath)
        t.start()
        t.join()
        self.onReadFinish()
        
    def initUI(self):
        self.parent.title("请等待。。。")
        self.pack(fill=BOTH, expand=1)
        self.label = Label(self, text="请等待...")        
        self.label.place(x=60, y=80)
        
    def centerWindow(self):
        w = 300
        h = 150
        sw = self.parent.winfo_screenwidth()
        sh = self.parent.winfo_screenheight()
        x = (sw - w)/2
        y = (sh - h)/2
        self.parent.geometry('%dx%d+%d+%d' % (w, h, x, y))
    

class SelectFileUI(Frame):
    def __init__(self, parent):
        Frame.__init__(self,parent)
        self.filePath = None
        self.parent = parent
        self.initUI()
        self.centerWindow()
    
    def initUI(self):
        self.parent.title("选择聊天日志文件")
        self.pack(fill=BOTH, expand=1)
        self.selectFileBtn = Button(self, text="请选择日志文件", command=self.selectClick)
        self.selectFileBtn.place(x = 100 , y = 20)
        self.nextBtn = Button(self, text="下一步", command=self.nextClick)
        self.nextBtn.place(x = 120 , y = 120)
        self.var = StringVar()
        self.label = Label(self, text=0, textvariable=self.var)        
        self.label.place(x=60, y=80)
        
    def selectClick(self):
        ftypes = [('Text files', '*.txt'), ('All files', '*')]
        dlg = fileDialog.Open(self, filetypes = ftypes)
        file = dlg.show()
        if file != '':
            self.filePath = file
            self.var.set(file)
    
    def nextClick(self):
        if self.filePath and self.filePath != '':
            self.parent.destroy()
            readFile(self.filePath)
        else:
            box.showerror("错误", "请选择聊天日志文件!")

    def centerWindow(self):
        w = 300
        h = 150
        sw = self.parent.winfo_screenwidth()
        sh = self.parent.winfo_screenheight()
        x = (sw - w)/2
        y = (sh - h)/2
        self.parent.geometry('%dx%d+%d+%d' % (w, h, x, y))

class ChooseNameUI(Frame):
    def __init__(self, parent,names=["1","2","3"]):
        Frame.__init__(self, parent)   
        self.parent = parent       
        self.names = names 
        self.initUI()
        self.centerWindow()
        
    def initUI(self):
        self.parent.title("选择角色名字") 
        self.pack(fill=BOTH, expand=1)
        "source list"
        self.lb = Listbox(self)
        for i in self.names:
            self.lb.insert(END, i)
        self.lb.bind("<<ListboxSelect>>", self.onSelect)    
        self.lb.place(x=80, y=20)
        "right list"
        self.lbRight = Listbox(self)
        #self.lbRight.bind("<<ListboxSelect>>", self.onSelect)    
        self.lbRight.place(x=150, y=240)
        "left list"
        self.lbLeft = Listbox(self)
        #self.lbLeft.bind("<<ListboxSelect>>", self.onSelect)    
        self.lbLeft.place(x=20, y=240)
        "label"
        self.var = StringVar()
        self.label = Label(self, text=0, textvariable=self.var)        
        self.label.place(x=120, y=400)
        "left button"
        leftButton = Button(self, text="增加到自己的名字", command=self.leftClick)
        leftButton.place(x=20,y=180)
        "left add all button"
        leftAddAllBtn = Button(self, text="添加剩下的名字到自己", command=self.leftAddAllClick)
        leftAddAllBtn.place(x=20,y=210)
        "right button"
        rightButton = Button(self, text="增加到对方的名字", command=self.rightClick)
        rightButton.place(x = 150, y = 180)
        "right add all button"
        rightAddAllBtn = Button(self, text="添加剩下的名字到对方", command=self.rightAddAllClick)
        rightAddAllBtn.place(x=150,y=210)
        "move to right button"
        left2RightBtn = Button(self, text="移动到自己", command=self.move2Left)
        left2RightBtn.place(x=150,y=380)
        "move to left button"
        left2RightBtn = Button(self, text="移动到对方", command=self.move2Right)
        left2RightBtn.place(x=20,y=380)
        "finish button"
        self.finishBtn = Button(self, text="选择完毕", command = self.finishClick)
        self.finishBtn.place(x = 120 , y = 420)

    def onSelect(self, val):
        sender = val.widget
        idx = sender.curselection()
        if idx:
            value = sender.get(idx)   
            self.var.set(value)
    
    def leftClick(self):
        str = self.var.get()
        if str is not None and str != "":
            self.lbLeft.insert(END,str)
            self.removeSelection()
            
    def rightClick(self):
        str = self.var.get()
        if str is not None and str != "":
            self.lbRight.insert(END,str)
            self.removeSelection()
            
    def removeSelection(self):
        index = self.lb.curselection()
        self.lb.delete(index,index)
        self.var.set("")
        "if select all data finish"
        if not self.lb.get(0):
            self.finishClick()
    
    def finishClick(self):
        if self.lb.get(0):
            box.showerror("错误", "还有名字没加入")
        else:
            if not self.lbLeft.get(0):
                box.showerror("错误", "没有自己的名字，请选择")
            elif not self.lbRight.get(0):
                box.showerror("错误", "没有对方的名字，请选择")
            else:
                "get the two list and generate json"
                myList = [self.lbLeft.get(i) for i in xrange(self.lbLeft.size())]
                herList = [self.lbRight.get(i) for i in xrange(self.lbRight.size())]
                #conversationtool.generateJSON(myList,herList)
                t = conversationtool.generateThread(myList,herList)
                t.start()
                t.join()
            
    def rightAddAllClick(self):
        while self.lb.get(0):
            value = self.lb.get(0)
            self.lb.delete(0)
            self.lbRight.insert(END , value)
        self.var.set("")
    
    def leftAddAllClick(self):
        while self.lb.get(0):
            value = self.lb.get(0)
            self.lb.delete(0)
            self.lbLeft.insert(END,value)
        self.var.set("")
    
    def move2Right(self):
        index = self.lbLeft.curselection()
        if index:
            value = self.lbLeft.get(index)
            self.lbLeft.delete(index)
            self.lbRight.insert(END, value)
        else:
            box.showerror("错误", "请选择自己的名字")
        
    def move2Left(self):
        index = self.lbRight.curselection()
        if index:
            value = self.lbRight.get(index)
            self.lbRight.delete(index)
            self.lbLeft.insert(END , value)
        else:
            box.showerror("错误", "请选择对方的名字")
    
    def centerWindow(self):
        w = 300
        h = 450
        sw = self.parent.winfo_screenwidth()
        sh = self.parent.winfo_screenheight()
        x = (sw - w)/2
        y = (sh - h)/2
        self.parent.geometry('%dx%d+%d+%d' % (w, h, x, y))

def selectFile():
    root = Tk()
    ex = SelectFileUI(root)
    root.mainloop()  

def readFile(filePath):
    root = Tk()
    ex = WaitingUI(root,filePath)
    root.mainloop()

def chooseName(names):
    root = Tk()
    ex = ChooseNameUI(root,names)
    root.mainloop()

if __name__ == '__main__':
    reload(sys)
    sys.setdefaultencoding("utf-8")
    #chooseName(["1111111111111111","222222222222222222","3"])
    selectFile()
