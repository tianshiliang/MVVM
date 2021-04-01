/**
 * 1、app.message修改数据。vue内部如何监听message数据的改变
 * Object.defineProperty->监听对象属性的改变
 * 2、当数据发生改变，vue如何知道要通知哪些人，界面发生刷新
 * 发布者订阅者模式（订阅属性的改变）
 */
class MVVM{
    constructor(params) {
        var app = document.querySelector(params.el);
        this.dataKeyMapDom = {};
        // 对数据进行劫持,在set里面处理DOM
        this.initData(params.data);
        // 递归遍历DOM数，通过data的key建立key与DOM的映射
        this.dataKeyMapDomFun(app);
        // 事件绑定，执行事件后刷新数据
        this.bindEvent();
     };
     initData(data) {
        const _this = this;
        this.data = {};
        for(let key in data){
            Object.defineProperty(this.data,key,{
                get(){
                    console.log('get数据：',key,data[key]);
                    return data[key];
                },
                set(newValue){
                    console.log('set数据：',key,newValue);
                    data[key] = newValue;
                    // 更改视图
                    _this.dataKeyMapDom[key] && _this.dataKeyMapDom[key].forEach(element=>{
                        element.innerHTML = newValue;
                    })
                }
            })
        }
     }
     dataKeyMapDomFun (el=app) {
        if (el.childNodes.length) {
            el.childNodes.forEach(element => {
                let value = element.nodeValue;
                // nodeType:3为文本域，nodeType:1为html标签
                if (value) {
                    value= value.trim();
                    // 文本
                    if (element.nodeType==3 && /\{\{(.+?)\}\}/.test(value)) {
                        const key = value.match(/\{\{(.+?)\}\}/)[1];
                        if (this.dataKeyMapDom[key]) {
                            this.dataKeyMapDom[key].push(element.parentNode);
                        } else {
                            this.dataKeyMapDom[key] = [element.parentNode];
                        }
                        element.parentNode.innerHTML = this.data[key]||'';
                    }
                } else {
                    // html标签
                    if (element.nodeType==1) {
                        this.dataKeyMapDomFun(element);
                    }
                }
            });
        }
        
   }
   bindEvent() {
        // 绑定事件处理函数并且修改
        const _this = this;
        const allInputs = document.querySelectorAll('input');
        allInputs.forEach((input)=>{
            const key = input.getAttribute('v-model');
            console.log(key);
            if (key) {
                input.onkeyup = function() {
                    _this.data[key] = input.value;
                }
            }
        })
   }
   
}