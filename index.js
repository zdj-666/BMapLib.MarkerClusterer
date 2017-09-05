(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
   typeof define === 'function' && define.amd ? define(factory) :
   (global.BMapLib = global.BMapLib || {}, global.BMapLib.MarkerClusterer = factory());
}(this, function () { 'use strict';

   var __commonjs_global = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this;
   function __commonjs(fn, module) { return module = { exports: {} }, fn(module, module.exports, __commonjs_global), module.exports; }

   var index = __commonjs(function (module, exports, global) {
   (function (root, factory) {  
       if (typeof exports === 'object') {  
           module.exports = factory();
       } else if (typeof define === 'function' && define.amd) {  
           define(factory);  
       } else {
           root.BMapLib = root.BMapLib || {};
           root.BMapLib.TextIconOverlay = root.BMapLib.TextIconOverlay || factory();  
       }  
   })(__commonjs_global, function() {
       var T,
       baidu = T = baidu || {version: "1.3.8"}; 
       
       //提出guid，防止在与老版本Tangram混用时
       //在下一行错误的修改window[undefined]
       baidu.guid = "$BAIDU$";

       //Tangram可能被放在闭包中
       //一些页面级别唯一的属性，需要挂载在window[baidu.guid]上
       window[baidu.guid] = window[baidu.guid] || {};

       /**         
       * @ignore
       * @namespace baidu.dom 操作dom的方法。
       */
       baidu.dom = baidu.dom || {};

       
       /**
        * 从文档中获取指定的DOM元素
        * @name baidu.dom.g
        * @function
        * @grammar baidu.dom.g(id)
        * @param {string|HTMLElement} id 元素的id或DOM元素
        * @shortcut g,T.G
        * @meta standard
        * @see baidu.dom.q
        *             
        * @returns {HTMLElement|null} 获取的元素，查找不到时返回null,如果参数不合法，直接返回参数
        */
       baidu.dom.g = function (id) {
           if ('string' == typeof id || id instanceof String) {
               return document.getElementById(id);
           } else if (id && id.nodeName && (id.nodeType == 1 || id.nodeType == 9)) {
               return id;
           }
           return null;
       };

       // 声明快捷方法
       baidu.g = baidu.G = baidu.dom.g;

       /**
        * 获取目标元素所属的document对象
        * @name baidu.dom.getDocument
        * @function
        * @grammar baidu.dom.getDocument(element)
        * @param {HTMLElement|string} element 目标元素或目标元素的id
        * @meta standard
        * @see baidu.dom.getWindow
        *             
        * @returns {HTMLDocument} 目标元素所属的document对象
        */
       baidu.dom.getDocument = function (element) {
           element = baidu.dom.g(element);
           return element.nodeType == 9 ? element : element.ownerDocument || element.document;
       };

       /**
            * @ignore
        * @namespace baidu.lang 对语言层面的封装，包括类型判断、模块扩展、继承基类以及对象自定义事件的支持。
       */
       baidu.lang = baidu.lang || {};

       /**
        * 判断目标参数是否string类型或String对象
        * @name baidu.lang.isString
        * @function
        * @grammar baidu.lang.isString(source)
        * @param {Any} source 目标参数
        * @shortcut isString
        * @meta standard
        * @see baidu.lang.isObject,baidu.lang.isNumber,baidu.lang.isArray,baidu.lang.isElement,baidu.lang.isBoolean,baidu.lang.isDate
        *             
        * @returns {boolean} 类型判断结果
        */
       baidu.lang.isString = function (source) {
           return '[object String]' == Object.prototype.toString.call(source);
       };

       // 声明快捷方法
       baidu.isString = baidu.lang.isString;

       /**
        * 从文档中获取指定的DOM元素
        * **内部方法**
        * 
        * @param {string|HTMLElement} id 元素的id或DOM元素
        * @meta standard
        * @return {HTMLElement} DOM元素，如果不存在，返回null，如果参数不合法，直接返回参数
        */
       baidu.dom._g = function (id) {
           if (baidu.lang.isString(id)) {
               return document.getElementById(id);
           }
           return id;
       };

       // 声明快捷方法
       baidu._g = baidu.dom._g;

       /**
        * @ignore
        * @namespace baidu.browser 判断浏览器类型和特性的属性。
        */
       baidu.browser = baidu.browser || {};

       if (/msie (\d+\.\d)/i.test(navigator.userAgent)) {
           //IE 8下，以documentMode为准
           //在百度模板中，可能会有$，防止冲突，将$1 写成 \x241
           /**
            * 判断是否为ie浏览器
            * @property ie ie版本号
            * @grammar baidu.browser.ie
            * @meta standard
            * @shortcut ie
            * @see baidu.browser.firefox,baidu.browser.safari,baidu.browser.opera,baidu.browser.chrome,baidu.browser.maxthon 
            */
           baidu.browser.ie = baidu.ie = document.documentMode || + RegExp['\x241'];
       }

       /**
        * 获取目标元素的computed style值。如果元素的样式值不能被浏览器计算，则会返回空字符串（IE）
        *
        * @author berg
        * @name baidu.dom.getComputedStyle
        * @function
        * @grammar baidu.dom.getComputedStyle(element, key)
        * @param {HTMLElement|string} element 目标元素或目标元素的id
        * @param {string} key 要获取的样式名
        *
        * @see baidu.dom.getStyle
        *             
        * @returns {string} 目标元素的computed style值
        */

       baidu.dom.getComputedStyle = function(element, key){
           element = baidu.dom._g(element);
           var doc = baidu.dom.getDocument(element),
               styles;
           if (doc.defaultView && doc.defaultView.getComputedStyle) {
               styles = doc.defaultView.getComputedStyle(element, null);
               if (styles) {
                   return styles[key] || styles.getPropertyValue(key);
               }
           }
           return ''; 
       };

       /**
        * 提供给setStyle与getStyle使用
        */
       baidu.dom._styleFixer = baidu.dom._styleFixer || {};

       /**
        * 提供给setStyle与getStyle使用
        */
       baidu.dom._styleFilter = baidu.dom._styleFilter || [];

       /**
        * 为获取和设置样式的过滤器
        * @private
        * @meta standard
        */
       baidu.dom._styleFilter.filter = function (key, value, method) {
           for (var i = 0, filters = baidu.dom._styleFilter, filter; filter = filters[i]; i++) {
               if (filter = filter[method]) {
                   value = filter(key, value);
               }
           }
           return value;
       };

       /**
            * @ignore
        * @namespace baidu.string 操作字符串的方法。
        */
       baidu.string = baidu.string || {};

       /**
        * 将目标字符串进行驼峰化处理
        * @name baidu.string.toCamelCase
        * @function
        * @grammar baidu.string.toCamelCase(source)
        * @param {string} source 目标字符串
        * @remark
        * 支持单词以“-_”分隔
        * @meta standard
        *             
        * @returns {string} 驼峰化处理后的字符串
        */
       baidu.string.toCamelCase = function (source) {
           //提前判断，提高getStyle等的效率 thanks xianwei
           if (source.indexOf('-') < 0 && source.indexOf('_') < 0) {
               return source;
           }
           return source.replace(/[-_][^-_]/g, function (match) {
               return match.charAt(1).toUpperCase();
           });
       };

       /**
        * 获取目标元素的样式值
        * @name baidu.dom.getStyle
        * @function
        * @grammar baidu.dom.getStyle(element, key)
        * @param {HTMLElement|string} element 目标元素或目标元素的id
        * @param {string} key 要获取的样式名
        * @remark
        * 
        * 为了精简代码，本模块默认不对任何浏览器返回值进行归一化处理（如使用getStyle时，不同浏览器下可能返回rgb颜色或hex颜色），也不会修复浏览器的bug和差异性（如设置IE的float属性叫styleFloat，firefox则是cssFloat）。<br />
        * baidu.dom._styleFixer和baidu.dom._styleFilter可以为本模块提供支持。<br />
        * 其中_styleFilter能对颜色和px进行归一化处理，_styleFixer能对display，float，opacity，textOverflow的浏览器兼容性bug进行处理。	
        * @shortcut getStyle
        * @meta standard
        * @see baidu.dom.setStyle,baidu.dom.setStyles, baidu.dom.getComputedStyle
        *             
        * @returns {string} 目标元素的样式值
        */
       baidu.dom.getStyle = function (element, key) {
           var dom = baidu.dom;

           element = dom.g(element);
           key = baidu.string.toCamelCase(key);
           //computed style, then cascaded style, then explicitly set style.
           var value = element.style[key] ||
                       (element.currentStyle ? element.currentStyle[key] : "") || 
                       dom.getComputedStyle(element, key);

           // 在取不到值的时候，用fixer进行修正
           if (!value) {
               var fixer = dom._styleFixer[key];
               if(fixer){
                   value = fixer.get ? fixer.get(element) : baidu.dom.getStyle(element, fixer);
               }
           }

           /* 检查结果过滤器 */
           if (fixer = dom._styleFilter) {
               value = fixer.filter(key, value, 'get');
           }

           return value;
       };

       // 声明快捷方法
       baidu.getStyle = baidu.dom.getStyle;


       if (/opera\/(\d+\.\d)/i.test(navigator.userAgent)) {
       /**
        * 判断是否为opera浏览器
        * @property opera opera版本号
        * @grammar baidu.browser.opera
        * @meta standard
        * @see baidu.browser.ie,baidu.browser.firefox,baidu.browser.safari,baidu.browser.chrome 
        */
           baidu.browser.opera = + RegExp['\x241'];
       }

       /**
        * 判断是否为webkit内核
        * @property isWebkit 
        * @grammar baidu.browser.isWebkit
        * @meta standard
        * @see baidu.browser.isGecko
        */
       baidu.browser.isWebkit = /webkit/i.test(navigator.userAgent);

       /**
        * 判断是否为gecko内核
        * @property isGecko 
        * @grammar baidu.browser.isGecko
        * @meta standard
        * @see baidu.browser.isWebkit
        */
       baidu.browser.isGecko = /gecko/i.test(navigator.userAgent) && !/like gecko/i.test(navigator.userAgent);

       /**
        * 判断是否严格标准的渲染模式
        * @property isStrict 
        * @grammar baidu.browser.isStrict
        * @meta standard
        */
       baidu.browser.isStrict = document.compatMode == "CSS1Compat";

       /**
        * 获取目标元素相对于整个文档左上角的位置
        * @name baidu.dom.getPosition
        * @function
        * @grammar baidu.dom.getPosition(element)
        * @param {HTMLElement|string} element 目标元素或目标元素的id
        * @meta standard
        *             
        * @returns {Object} 目标元素的位置，键值为top和left的Object。
        */
       baidu.dom.getPosition = function (element) {
           element = baidu.dom.g(element);
           var doc = baidu.dom.getDocument(element), 
               browser = baidu.browser,
               getStyle = baidu.dom.getStyle,
           // Gecko 1.9版本以下用getBoxObjectFor计算位置
           // 但是某些情况下是有bug的
           // 对于这些有bug的情况
           // 使用递归查找的方式
               BUGGY_GECKO_BOX_OBJECT = browser.isGecko > 0 && 
                                           doc.getBoxObjectFor &&
                                           getStyle(element, 'position') == 'absolute' &&
                                           (element.style.top === '' || element.style.left === ''),
               pos = {"left":0,"top":0},
               viewport = (browser.ie && !browser.isStrict) ? doc.body : doc.documentElement,
               parent,
               box;

           if(element == viewport){
               return pos;
           }

           if(element.getBoundingClientRect){ // IE and Gecko 1.9+
       
               //当HTML或者BODY有border width时, 原生的getBoundingClientRect返回值是不符合预期的
               //考虑到通常情况下 HTML和BODY的border只会设成0px,所以忽略该问题.
               box = element.getBoundingClientRect();

               pos.left = Math.floor(box.left) + Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
               pos.top  = Math.floor(box.top)  + Math.max(doc.documentElement.scrollTop,  doc.body.scrollTop);
       
               // IE会给HTML元素添加一个border，默认是medium（2px）
               // 但是在IE 6 7 的怪异模式下，可以被html { border: 0; } 这条css规则覆盖
               // 在IE7的标准模式下，border永远是2px，这个值通过clientLeft 和 clientTop取得
               // 但是。。。在IE 6 7的怪异模式，如果用户使用css覆盖了默认的medium
               // clientTop和clientLeft不会更新
               pos.left -= doc.documentElement.clientLeft;
               pos.top  -= doc.documentElement.clientTop;
       
               var htmlDom = doc.body,
                   // 在这里，不使用element.style.borderLeftWidth，只有computedStyle是可信的
                   htmlBorderLeftWidth = parseInt(getStyle(htmlDom, 'borderLeftWidth')),
                   htmlBorderTopWidth = parseInt(getStyle(htmlDom, 'borderTopWidth'));
               if(browser.ie && !browser.isStrict){
                   pos.left -= isNaN(htmlBorderLeftWidth) ? 2 : htmlBorderLeftWidth;
                   pos.top  -= isNaN(htmlBorderTopWidth) ? 2 : htmlBorderTopWidth;
               }
           } else { 
               // safari/opera/firefox
               parent = element;

               do {
                   pos.left += parent.offsetLeft;
                   pos.top  += parent.offsetTop;
       
                   // safari里面，如果遍历到了一个fixed的元素，后面的offset都不准了
                   if (browser.isWebkit > 0 && getStyle(parent, 'position') == 'fixed') {
                       pos.left += doc.body.scrollLeft;
                       pos.top  += doc.body.scrollTop;
                       break;
                   }
           
                   parent = parent.offsetParent;
               } while (parent && parent != element);

               // 对body offsetTop的修正
               if(browser.opera > 0 || (browser.isWebkit > 0 && getStyle(element, 'position') == 'absolute')){
                   pos.top  -= doc.body.offsetTop;
               }

               // 计算除了body的scroll
               parent = element.offsetParent;
               while (parent && parent != doc.body) {
                   pos.left -= parent.scrollLeft;
                   // see https://bugs.opera.com/show_bug.cgi?id=249965
                   if (!browser.opera || parent.tagName != 'TR') {
                       pos.top -= parent.scrollTop;
                   }
                   parent = parent.offsetParent;
               }
           }

           return pos;
       };

       /**
        * @ignore
        * @namespace baidu.event 屏蔽浏览器差异性的事件封装。
        * @property target 	事件的触发元素
        * @property pageX 		鼠标事件的鼠标x坐标
        * @property pageY 		鼠标事件的鼠标y坐标
        * @property keyCode 	键盘事件的键值
        */
       baidu.event = baidu.event || {};

       /**
        * 事件监听器的存储表
        * @private
        * @meta standard
        */
       baidu.event._listeners = baidu.event._listeners || [];

       /**
        * 为目标元素添加事件监听器
        * @name baidu.event.on
        * @function
        * @grammar baidu.event.on(element, type, listener)
        * @param {HTMLElement|string|window} element 目标元素或目标元素id
        * @param {string} type 事件类型
        * @param {Function} listener 需要添加的监听器
        * @remark
        * 
       1. 不支持跨浏览器的鼠标滚轮事件监听器添加<br>
       2. 改方法不为监听器灌入事件对象，以防止跨iframe事件挂载的事件对象获取失败

           * @shortcut on
           * @meta standard
           * @see baidu.event.un
           *             
           * @returns {HTMLElement|window} 目标元素
           */
       baidu.event.on = function (element, type, listener) {
           type = type.replace(/^on/i, '');
           element = baidu.dom._g(element);

           var realListener = function (ev) {
                   // 1. 这里不支持EventArgument,  原因是跨frame的事件挂载
                   // 2. element是为了修正this
                   listener.call(element, ev);
               },
               lis = baidu.event._listeners,
               filter = baidu.event._eventFilter,
               afterFilter,
               realType = type;
           type = type.toLowerCase();
           // filter过滤
           if(filter && filter[type]){
               afterFilter = filter[type](element, type, realListener);
               realType = afterFilter.type;
               realListener = afterFilter.listener;
           }

           // 事件监听器挂载
           if (element.addEventListener) {
               element.addEventListener(realType, realListener, false);
           } else if (element.attachEvent) {
               element.attachEvent('on' + realType, realListener);
           }

           // 将监听器存储到数组中
           lis[lis.length] = [element, type, listener, realListener, realType];
           return element;
       };

       // 声明快捷方法
       baidu.on = baidu.event.on;

       /**
        * 返回一个当前页面的唯一标识字符串。
        * @name baidu.lang.guid
        * @function
        * @grammar baidu.lang.guid()
        * @version 1.1.1
        * @meta standard
        *             
        * @returns {String} 当前页面的唯一标识字符串
        */

       (function(){
           //不直接使用window，可以提高3倍左右性能
           var guid = window[baidu.guid];

           baidu.lang.guid = function() {
               return "TANGRAM__" + (guid._counter ++).toString(36);
           };

           guid._counter = guid._counter || 1;
       })();

       /**
        * 所有类的实例的容器
        * key为每个实例的guid
        * @meta standard
        */

       window[baidu.guid]._instances = window[baidu.guid]._instances || {};

       /**
        * 判断目标参数是否为function或Function实例
        * @name baidu.lang.isFunction
        * @function
        * @grammar baidu.lang.isFunction(source)
        * @param {Any} source 目标参数
        * @version 1.2
        * @see baidu.lang.isString,baidu.lang.isObject,baidu.lang.isNumber,baidu.lang.isArray,baidu.lang.isElement,baidu.lang.isBoolean,baidu.lang.isDate
        * @meta standard
        * @returns {boolean} 类型判断结果
        */
       baidu.lang.isFunction = function (source) {
           // chrome下,'function' == typeof /a/ 为true.
           return '[object Function]' == Object.prototype.toString.call(source);
       };

       /**
        *    
        * @ignore
        * @class  Tangram继承机制提供的一个基类，用户可以通过继承baidu.lang.Class来获取它的属性及方法。
        * @name 	baidu.lang.Class
        * @grammar baidu.lang.Class(guid)
        * @param 	{string}	guid	对象的唯一标识
        * @meta standard
        * @remark baidu.lang.Class和它的子类的实例均包含一个全局唯一的标识guid。guid是在构造函数中生成的，因此，继承自baidu.lang.Class的类应该直接或者间接调用它的构造函数。<br>baidu.lang.Class的构造函数中产生guid的方式可以保证guid的唯一性，及每个实例都有一个全局唯一的guid。
        * @meta standard
        * @see baidu.lang.inherits,baidu.lang.Event
        */
       baidu.lang.Class = function(guid) {
           this.guid = guid || baidu.lang.guid();
           window[baidu.guid]._instances[this.guid] = this;
       };
       window[baidu.guid]._instances = window[baidu.guid]._instances || {};

       /**
        * 释放对象所持有的资源，主要是自定义事件。
        * @name dispose
        * @grammar obj.dispose()
        */
       baidu.lang.Class.prototype.dispose = function(){
           delete window[baidu.guid]._instances[this.guid];

           for(var property in this){
               if (!baidu.lang.isFunction(this[property])) {
                   delete this[property];
               }
           }
           this.disposed = true;
       };

       /**
        * 重载了默认的toString方法，使得返回信息更加准确一些。
        * @return {string} 对象的String表示形式
        */
       baidu.lang.Class.prototype.toString = function(){
           return "[object " + (this._className || "Object" ) + "]";
       };

       /**
        * @ignore
        * @class   自定义的事件对象。
        * @name 	baidu.lang.Event
        * @grammar baidu.lang.Event(type[, target])
        * @param 	{string} type	 事件类型名称。为了方便区分事件和一个普通的方法，事件类型名称必须以"on"(小写)开头。
        * @param 	{Object} [target]触发事件的对象
        * @meta standard
        * @remark 引入该模块，会自动为Class引入3个事件扩展方法：addEventListener、removeEventListener和dispatchEvent。
        * @meta standard
        * @see baidu.lang.Class
        */
       baidu.lang.Event = function (type, target) {
           this.type = type;
           this.returnValue = true;
           this.target = target || null;
           this.currentTarget = null;
       };

       /**
        * 注册对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
        * @grammar obj.addEventListener(type, handler[, key])
        * @param 	{string}   type         自定义事件的名称
        * @param 	{Function} handler      自定义事件被触发时应该调用的回调函数
        * @param 	{string}   [key]		为事件监听函数指定的名称，可在移除时使用。如果不提供，方法会默认为它生成一个全局唯一的key。
        * @remark 	事件类型区分大小写。如果自定义事件名称不是以小写"on"开头，该方法会给它加上"on"再进行判断，即"click"和"onclick"会被认为是同一种事件。 
        */
       baidu.lang.Class.prototype.addEventListener = function (type, handler, key) {
           if (!baidu.lang.isFunction(handler)) {
               return;
           }

           !this.__listeners && (this.__listeners = {});

           var t = this.__listeners, id;
           if (typeof key == "string" && key) {
               if (/[^\w\-]/.test(key)) {
                   throw("nonstandard key:" + key);
               } else {
                   handler.hashCode = key; 
                   id = key;
               }
           }
           type.indexOf("on") != 0 && (type = "on" + type);

           typeof t[type] != "object" && (t[type] = {});
           id = id || baidu.lang.guid();
           handler.hashCode = id;
           t[type][id] = handler;
       };

       /**
        * 移除对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
        * @grammar obj.removeEventListener(type, handler)
        * @param {string}   type     事件类型
        * @param {Function|string} handler  要移除的事件监听函数或者监听函数的key
        * @remark 	如果第二个参数handler没有被绑定到对应的自定义事件中，什么也不做。
        */
       baidu.lang.Class.prototype.removeEventListener = function (type, handler) {
           if (typeof handler != "undefined") {
               if ( (baidu.lang.isFunction(handler) && ! (handler = handler.hashCode))
                   || (! baidu.lang.isString(handler))
               ){
                   return;
               }
           }

           !this.__listeners && (this.__listeners = {});

           type.indexOf("on") != 0 && (type = "on" + type);

           var t = this.__listeners;
           if (!t[type]) {
               return;
           }
           if (typeof handler != "undefined") {
               t[type][handler] && delete t[type][handler];
           } else {
               for(var guid in t[type]){
                   delete t[type][guid];
               }
           }
       };

       /**
        * 派发自定义事件，使得绑定到自定义事件上面的函数都会被执行。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
        * @grammar obj.dispatchEvent(event, options)
        * @param {baidu.lang.Event|String} event 	Event对象，或事件名称(1.1.1起支持)
        * @param {Object} 					options 扩展参数,所含属性键值会扩展到Event对象上(1.2起支持)
        * @remark 处理会调用通过addEventListenr绑定的自定义事件回调函数之外，还会调用直接绑定到对象上面的自定义事件。例如：<br>
       myobj.onMyEvent = function(){}<br>
       myobj.addEventListener("onMyEvent", function(){});
           */
       baidu.lang.Class.prototype.dispatchEvent = function (event, options) {
           if (baidu.lang.isString(event)) {
               event = new baidu.lang.Event(event);
           }
           !this.__listeners && (this.__listeners = {});

           // 20100603 添加本方法的第二个参数，将 options extend到event中去传递
           options = options || {};
           for (var i in options) {
               event[i] = options[i];
           }

           var i, t = this.__listeners, p = event.type;
           event.target = event.target || this;
           event.currentTarget = this;

           p.indexOf("on") != 0 && (p = "on" + p);

           baidu.lang.isFunction(this[p]) && this[p].apply(this, arguments);

           if (typeof t[p] == "object") {
               for (i in t[p]) {
                   t[p][i].apply(this, arguments);
               }
           }
           return event.returnValue;
       };


       baidu.lang.inherits = function (subClass, superClass, className) {
           var key, proto,
               selfProps = subClass.prototype,
               clazz = new Function();

           clazz.prototype = superClass.prototype;
           proto = subClass.prototype = new clazz();
           for (key in selfProps) {
               proto[key] = selfProps[key];
           }
           subClass.prototype.constructor = subClass;
           subClass.superClass = superClass.prototype;

           // 类名标识，兼容Class的toString，基本没用
           if ("string" == typeof className) {
               proto._className = className;
           }
       };
       // 声明快捷方法
       baidu.inherits = baidu.lang.inherits;


       /**
       
        * 图片的路径

        * @private
        * @type {String}
       
        */
       var _IMAGE_PATH = 'http://api.map.baidu.com/library/TextIconOverlay/1.2/src/images/m';

       /**
       
        * 图片的后缀名

         * @private
        * @type {String}
       
        */
       var _IMAGE_EXTENSION  = 'png';

       /**
        *@exports TextIconOverlay as BMapLib.TextIconOverlay
        */
       
       /**
       * TextIconOverlay
       * @class 此类表示地图上的一个覆盖物，该覆盖物由文字和图标组成，从Overlay继承。文字通常是数字（0-9）或字母（A-Z ），而文字与图标之间有一定的映射关系。
       *该覆盖物适用于以下类似的场景：需要在地图上添加一系列覆盖物，这些覆盖物之间用不同的图标和文字来区分，文字可能表示了该覆盖物的某一属性值，根据该文字和一定的映射关系，自动匹配相应颜色和大小的图标。
       *
       *@constructor
       *@param {Point} position 表示一个经纬度坐标位置。
       *@param {String} text 表示该覆盖物显示的文字信息。
       *@param {Json Object} options 可选参数，可选项包括：<br />
       *"<b>styles</b>":{Array<IconStyle>} 一组图标风格。单个图表风格包括以下几个属性：<br />
       *   url	{String}	 图片的url地址。(必选)<br />
       *   size {Size}	图片的大小。（必选）<br />
       *   anchor {Size} 图标定位在地图上的位置相对于图标左上角的偏移值，默认偏移值为图标的中心位置。（可选）<br />
       *   offset {Size} 图片相对于可视区域的偏移值，此功能的作用等同于CSS中的background-position属性。（可选）<br />
       *   textSize {Number} 文字的大小。（可选，默认10）<br />
       *   textColor {String} 文字的颜色。（可选，默认black）<br />
       */
       var TextIconOverlay = function(position, text, options){
           try {
               BMap;
           } catch (e) {
               throw Error('Baidu Map JS API is not ready yet!');
           }
           T.lang.inherits(TextIconOverlay, BMap.Overlay, "TextIconOverlay");
           this._position = position;
           this._text = text;
           this._options = options || {};
           this._styles = this._options['styles'] || [];
           (!this._styles.length) && this._setupDefaultStyles();                  
       };


       TextIconOverlay.prototype._setupDefaultStyles = function(){  
           var sizes = [53, 56, 66, 78, 90];
           for(var i = 0, size; size = sizes[i]; i++){
               this._styles.push({
                   url:_IMAGE_PATH + i + '.' + _IMAGE_EXTENSION,
                   size: new BMap.Size(size, size)
               });
           }//for循环的简洁写法
       };

       /**
       *继承Overlay的intialize方法，自定义覆盖物时必须。
       *@param {Map} map BMap.Map的实例化对象。
       *@return {HTMLElement} 返回覆盖物对应的HTML元素。
       */
       TextIconOverlay.prototype.initialize = function(map){
           this._map = map;
       
           this._domElement = document.createElement('div');     
           this._updateCss();    
           this._updateText();
           this._updatePosition(); 
           
           this._bind();

           this._map.getPanes().markerMouseTarget.appendChild(this._domElement);
           return this._domElement;   
       };

       /**
       *继承Overlay的draw方法，自定义覆盖物时必须。
       *@return 无返回值。
       */
       TextIconOverlay.prototype.draw = function(){
           this._map && this._updatePosition();
       };
       
       /**
       *获取该覆盖物上的文字。
       *@return {String} 该覆盖物上的文字。
       */
       TextIconOverlay.prototype.getText = function(){
           return this._text;
       };

       /**
       *设置该覆盖物上的文字。
       *@param {String} text 要设置的文字，通常是字母A-Z或数字0-9。
       *@return 无返回值。
       */
       TextIconOverlay.prototype.setText = function(text){
           if(text && (!this._text || (this._text.toString() != text.toString()))){
               this._text = text;
               this._updateText();
               this._updateCss();
               this._updatePosition(); 
           }
       };

       /**
       *获取该覆盖物的位置。
       *@return {Point} 该覆盖物的经纬度坐标。
       */
       TextIconOverlay.prototype.getPosition = function () {
           return this._position;
       };
      
       /**
       *设置该覆盖物的位置。
       *@param {Point}  position 要设置的经纬度坐标。
       *@return 无返回值。
       */
       TextIconOverlay.prototype.setPosition = function (position) {
           if(position && (!this._position || !this._position.equals(position))){
               this._position = position;  
               this._updatePosition();
           }
       };

       /**
       *由文字信息获取风格数组的对应索引值。
       *内部默认的对应函数为文字转换为数字除以10的结果，比如文字8返回索引0，文字25返回索引2.
       *如果需要自定义映射关系，请覆盖该函数。
       *@param {String} text  文字。
       *@param {Array<IconStyle>}  styles 一组图标风格。
       *@return {Number} 对应的索引值。
       */
       TextIconOverlay.prototype.getStyleByText = function(text, styles){
           var count = parseInt(text);
           var index = parseInt(count / 10);
           index = Math.max(0, index);
           index = Math.min(index, styles.length - 1);
           return styles[index]; 
       }

       /**
       *更新相应的CSS。
       *@return 无返回值。
       */
       TextIconOverlay.prototype._updateCss = function(){
           var style = this.getStyleByText(this._text, this._styles);
           this._domElement.style.cssText = this._buildCssText(style);
       };

       /**
       *更新覆盖物的显示文字。
       *@return 无返回值。
       */
       TextIconOverlay.prototype._updateText = function(){
           if (this._domElement) {
               this._domElement.innerHTML = this._text;
           }
       };

       /**
       *调整覆盖物在地图上的位置更新覆盖物的显示文字。
       *@return 无返回值。
       */
       TextIconOverlay.prototype._updatePosition = function(){
           if (this._domElement && this._position) {
               var style = this._domElement.style;
               var pixelPosition= this._map.pointToOverlayPixel(this._position); 
               pixelPosition.x -= Math.ceil(parseInt(style.width) / 2);
               pixelPosition.y -= Math.ceil(parseInt(style.height) / 2);       
               style.left = pixelPosition.x + "px";
               style.top = pixelPosition.y + "px";
           }
       };
       
       /**
       * 为该覆盖物的HTML元素构建CSS
       * @param {IconStyle}  一个图标的风格。
       * @return {String} 构建完成的CSSTEXT。
       */
       TextIconOverlay.prototype._buildCssText = function(style) {    
           //根据style来确定一些默认值
           var url = style['url'];
           var size = style['size'];
           var anchor = style['anchor'];
           var offset = style['offset'];
           var textColor = style['textColor'] || 'black';
           var textSize = style['textSize'] || 10;

           var csstext = [];
           if (T.browser["ie"] < 7) {
               csstext.push('filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(' +
                   'sizingMethod=scale,src="' + url + '");');
           } else {
               csstext.push('background-image:url(' + url + ');');
               var backgroundPosition = '0 0';
               (offset instanceof BMap.Size) && (backgroundPosition = offset.width + 'px' + ' ' + offset.height + 'px');          
               csstext.push('background-position:' + backgroundPosition + ';');
           }

           if (size instanceof BMap.Size){
               if (anchor instanceof BMap.Size) {
                   if (anchor.height > 0 && anchor.height < size.height) {
                         csstext.push('height:' + (size.height - anchor.height) + 'px; padding-top:' + anchor.height + 'px;');
                   }
                   if(anchor.width > 0 && anchor.width < size.width){
                       csstext.push('width:' + (size.width - anchor.width) + 'px; padding-left:' + anchor.width + 'px;');                
                   }
               } else {
                   csstext.push('height:' + size.height + 'px; line-height:' + size.height + 'px;');
                   csstext.push('width:' + size.width + 'px; text-align:center;');
               }
           }
      
           csstext.push('cursor:pointer; color:' + textColor + '; position:absolute; font-size:' +
               textSize + 'px; font-family:Arial,sans-serif; font-weight:bold');
           return csstext.join('');
       };


       /**
       
        * 当鼠标点击该覆盖物时会触发该事件

        * @name TextIconOverlay#click

        * @event

        * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
       
        * <br />"<b>type</b> : {String} 事件类型

        * <br />"<b>target</b>：{BMapLib.TextIconOverlay} 事件目标

        *

        */

       /**

        * 当鼠标进入该覆盖物区域时会触发该事件

        * @name TextIconOverlay#mouseover

        * @event
        * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
       
        * <br />"<b>type</b> : {String} 事件类型

        * <br />"<b>target</b>：{BMapLib.TextIconOverlay} 事件目标

        * <br />"<b>point</b> : {BMap.Point} 最新添加上的节点BMap.Point对象

        * <br />"<b>pixel</b>：{BMap.pixel} 最新添加上的节点BMap.Pixel对象

        *

        * @example <b>参考示例：</b><br />

        * myTextIconOverlay.addEventListener("mouseover", function(e) {  alert(e.point);  });

        */

       /**

        * 当鼠标离开该覆盖物区域时会触发该事件

        * @name TextIconOverlay#mouseout

        * @event

        * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：

        * <br />"<b>type</b> : {String} 事件类型

        * <br />"<b>target</b>：{BMapLib.TextIconOverlay} 事件目标

        * <br />"<b>point</b> : {BMap.Point} 最新添加上的节点BMap.Point对象

        * <br />"<b>pixel</b>：{BMap.pixel} 最新添加上的节点BMap.Pixel对象

        *

        * @example <b>参考示例：</b><br />

        * myTextIconOverlay.addEventListener("mouseout", function(e) {  alert(e.point);  });

        */


       /**
       * 为该覆盖物绑定一系列事件
       * 当前支持click mouseover mouseout
       * @return 无返回值。
       */
       TextIconOverlay.prototype._bind = function(){
           if (!this._domElement){
               return;
           }

           var me = this;
           var map = this._map;

           var BaseEvent = T.lang.Event;
           function eventExtend(e, be){
               var elem = e.srcElement || e.target;
               var x = e.clientX || e.pageX;
               var y = e.clientY || e.pageY;
               if (e && be && x && y && elem){
                   var offset = T.dom.getPosition(map.getContainer());
                   be.pixel = new BMap.Pixel(x - offset.left, y - offset.top);
                   be.point = map.pixelToPoint(be.pixel);
               }
               return be;
           }//给事件参数增加pixel和point两个值

           T.event.on(this._domElement,"mouseover", function(e){
               me.dispatchEvent(eventExtend(e, new BaseEvent("onmouseover")));
           });
           T.event.on(this._domElement,"mouseout", function(e){
               me.dispatchEvent(eventExtend(e, new BaseEvent("onmouseout")));
           });
           T.event.on(this._domElement,"click", function(e){
               me.dispatchEvent(eventExtend(e, new BaseEvent("onclick")));
           });
       };

       return TextIconOverlay;
   });
   });

   var TextIconOverlay = (index && typeof index === 'object' && 'default' in index ? index['default'] : index);

   /**
    * 获取一个扩展的视图范围，把上下左右都扩大一样的像素值。
    * @param {Map} map BMap.Map的实例化对象
    * @param {BMap.Bounds} bounds BMap.Bounds的实例化对象
    * @param {Number} gridSize 要扩大的像素值
    *
    * @return {BMap.Bounds} 返回扩大后的视图范围。
    */
   var getExtendedBounds = function(map, bounds, gridSize){
       bounds = cutBoundsInRange(bounds);
       var pixelNE = map.pointToPixel(bounds.getNorthEast());
       var pixelSW = map.pointToPixel(bounds.getSouthWest()); 
       pixelNE.x += gridSize;
       pixelNE.y -= gridSize;
       pixelSW.x -= gridSize;
       pixelSW.y += gridSize;
       var newNE = map.pixelToPoint(pixelNE);
       var newSW = map.pixelToPoint(pixelSW);
       return new BMap.Bounds(newSW, newNE);
   };

   /**
    * 按照百度地图支持的世界范围对bounds进行边界处理
    * @param {BMap.Bounds} bounds BMap.Bounds的实例化对象
    *
    * @return {BMap.Bounds} 返回不越界的视图范围
    */
   var cutBoundsInRange = function (bounds) {
       var maxX = getRange(bounds.getNorthEast().lng, -180, 180);
       var minX = getRange(bounds.getSouthWest().lng, -180, 180);
       var maxY = getRange(bounds.getNorthEast().lat, -74, 74);
       var minY = getRange(bounds.getSouthWest().lat, -74, 74);
       return new BMap.Bounds(new BMap.Point(minX, minY), new BMap.Point(maxX, maxY));
   }; 

   /**
    * 对单个值进行边界处理。
    * @param {Number} i 要处理的数值
    * @param {Number} min 下边界值
    * @param {Number} max 上边界值
    * 
    * @return {Number} 返回不越界的数值
    */
   var getRange = function (i, mix, max) {
       mix && (i = Math.max(i, mix));
       max && (i = Math.min(i, max));
       return i;
   };

   /**
    * 判断给定的对象是否为数组
    * @param {Object} source 要测试的对象
    *
    * @return {Boolean} 如果是数组返回true，否则返回false
    */
   var isArray = function (source) {
       return '[object Array]' === Object.prototype.toString.call(source);
   };

   /**
    * 返回item在source中的索引位置
    * @param {Object} item 要测试的对象
    * @param {Array} source 数组
    *
    * @return {Number} 如果在数组内，返回索引，否则返回-1
    */
   var indexOf = function(item, source){
       var index = -1;
       if(isArray(source)){
           if (source.indexOf) {
               index = source.indexOf(item);
           } else {
               for (var i = 0, m; m = source[i]; i++) {
                   if (m === item) {
                       index = i;
                       break;
                   }
               }
           }
       }        
       return index;
   };

   /**
    *@exports MarkerClusterer as BMapLib.MarkerClusterer
    */

       /**
        * MarkerClusterer
        * @class 用来解决加载大量点要素到地图上产生覆盖现象的问题，并提高性能
        * @constructor
        * @param {Map} map 地图的一个实例。
        * @param {Json Object} options 可选参数，可选项包括：<br />
        *    markers {Array<Marker>} 要聚合的标记数组<br />
        *    girdSize {Number} 聚合计算时网格的像素大小，默认60<br />
        *    maxZoom {Number} 最大的聚合级别，大于该级别就不进行相应的聚合<br />
        *    minClusterSize {Number} 最小的聚合数量，小于该数量的不能成为一个聚合，默认为2<br />
        *    isAverangeCenter {Boolean} 聚合点的落脚位置是否是所有聚合在内点的平均值，默认为否，落脚在聚合内的第一个点<br />
        *    styles {Array<IconStyle>} 自定义聚合后的图标风格，请参考TextIconOverlay类<br />
        */
   var MarkerClusterer  = function(map, options){
       try {
           BMap;
       } catch (e) {
           throw Error('Baidu Map JS API is not ready yet!');
       }
       if (!map){
           return;
       }
       this._map = map;
       this._markers = [];
       this._clusters = [];
       
       var opts = options || {};
       this._gridSize = opts["gridSize"] || 60;
       this._maxZoom = opts["maxZoom"] || 18;
       this._minClusterSize = opts["minClusterSize"] || 2;           
       this._isAverageCenter = false;
       if (opts['isAverageCenter'] != undefined) {
           this._isAverageCenter = opts['isAverageCenter'];
       }    
       this._styles = opts["styles"] || [];

       var that = this;
       this._map.addEventListener("zoomend",function(){
           that._redraw();     
       });

       this._map.addEventListener("moveend",function(){
               that._redraw();     
       });

       var mkrs = opts["markers"];
       isArray(mkrs) && this.addMarkers(mkrs);
   };

   /**
    * 添加要聚合的标记数组。
    * @param {Array<Marker>} markers 要聚合的标记数组
    *
    * @return 无返回值。
    */
   MarkerClusterer.prototype.addMarkers = function(markers){
       for(var i = 0, len = markers.length; i <len ; i++){
           this._pushMarkerTo(markers[i]);
       }
       this._createClusters();   
   };

   /**
    * 把一个标记添加到要聚合的标记数组中
    * @param {BMap.Marker} marker 要添加的标记
    *
    * @return 无返回值。
    */
   MarkerClusterer.prototype._pushMarkerTo = function(marker){
       var index = indexOf(marker, this._markers);
       if(index === -1){
           marker.isInCluster = false;
           this._markers.push(marker);//Marker拖放后enableDragging不做变化，忽略
       }
   };

   /**
    * 添加一个聚合的标记。
    * @param {BMap.Marker} marker 要聚合的单个标记。
    * @return 无返回值。
    */
   MarkerClusterer.prototype.addMarker = function(marker) {
       this._pushMarkerTo(marker);
       this._createClusters();
   };

   /**
    * 根据所给定的标记，创建聚合点
    * @return 无返回值
    */
   MarkerClusterer.prototype._createClusters = function(){
       var mapBounds = this._map.getBounds();
       var extendedBounds = getExtendedBounds(this._map, mapBounds, this._gridSize);
       for(var i = 0, marker; marker = this._markers[i]; i++){
           if(!marker.isInCluster && extendedBounds.containsPoint(marker.getPosition()) ){ 
               this._addToClosestCluster(marker);
           }
       }   
   };

   /**
    * 根据标记的位置，把它添加到最近的聚合中
    * @param {BMap.Marker} marker 要进行聚合的单个标记
    *
    * @return 无返回值。
    */
   MarkerClusterer.prototype._addToClosestCluster = function (marker){
       var distance = 4000000;
       var clusterToAddTo = null;
       var position = marker.getPosition();
       for(var i = 0, cluster; cluster = this._clusters[i]; i++){
           var center = cluster.getCenter();
           if(center){
               var d = this._map.getDistance(center, marker.getPosition());
               if(d < distance){
                   distance = d;
                   clusterToAddTo = cluster;
               }
           }
       }

       if (clusterToAddTo && clusterToAddTo.isMarkerInClusterBounds(marker)){
           clusterToAddTo.addMarker(marker);
       } else {
           var cluster = new Cluster(this);
           cluster.addMarker(marker);            
           this._clusters.push(cluster);
       }    
   };

   /**
    * 清除上一次的聚合的结果
    * @return 无返回值。
    */
   MarkerClusterer.prototype._clearLastClusters = function(){
       for(var i = 0, cluster; cluster = this._clusters[i]; i++){            
           cluster.remove();
       }
       this._clusters = [];//置空Cluster数组
       this._removeMarkersFromCluster();//把Marker的cluster标记设为false
   };

   /**
    * 清除某个聚合中的所有标记
    * @return 无返回值
    */
   MarkerClusterer.prototype._removeMarkersFromCluster = function(){
       for(var i = 0, marker; marker = this._markers[i]; i++){
           marker.isInCluster = false;
       }
   };

   /**
    * 把所有的标记从地图上清除
    * @return 无返回值
    */
   MarkerClusterer.prototype._removeMarkersFromMap = function(){
       for(var i = 0, marker; marker = this._markers[i]; i++){
           marker.isInCluster = false;
           this._map.removeOverlay(marker);       
       }
   };

   /**
    * 删除单个标记
    * @param {BMap.Marker} marker 需要被删除的marker
    *
    * @return {Boolean} 删除成功返回true，否则返回false
    */
   MarkerClusterer.prototype._removeMarker = function(marker) {
       var index = indexOf(marker, this._markers);
       if (index === -1) {
           return false;
       }
       this._map.removeOverlay(marker);
       this._markers.splice(index, 1);
       return true;
   };

   /**
    * 删除单个标记
    * @param {BMap.Marker} marker 需要被删除的marker
    *
    * @return {Boolean} 删除成功返回true，否则返回false
    */
   MarkerClusterer.prototype.removeMarker = function(marker) {
       var success = this._removeMarker(marker);
       if (success) {
           this._clearLastClusters();
           this._createClusters();
       }
       return success;
   };

   /**
    * 删除一组标记
    * @param {Array<BMap.Marker>} markers 需要被删除的marker数组
    *
    * @return {Boolean} 删除成功返回true，否则返回false
    */
   MarkerClusterer.prototype.removeMarkers = function(markers) {
       var success = false;
       for (var i = 0; i < markers.length; i++) {
           var r = this._removeMarker(markers[i]);
           success = success || r; 
       }

       if (success) {
           this._clearLastClusters();
           this._createClusters();
       }
       return success;
   };

   /**
    * 从地图上彻底清除所有的标记
    * @return 无返回值
    */
   MarkerClusterer.prototype.clearMarkers = function() {
       this._clearLastClusters();
       this._removeMarkersFromMap();
       this._markers = [];
   };

   /**
    * 重新生成，比如改变了属性等
    * @return 无返回值
    */
   MarkerClusterer.prototype._redraw = function () {
       this._clearLastClusters();
       this._createClusters();
   };

   /**
    * 获取网格大小
    * @return {Number} 网格大小
    */
   MarkerClusterer.prototype.getGridSize = function() {
       return this._gridSize;
   };

   /**
    * 设置网格大小
    * @param {Number} size 网格大小
    * @return 无返回值
    */
   MarkerClusterer.prototype.setGridSize = function(size) {
       this._gridSize = size;
       this._redraw();
   };

   /**
    * 获取聚合的最大缩放级别。
    * @return {Number} 聚合的最大缩放级别。
    */
   MarkerClusterer.prototype.getMaxZoom = function() {
       return this._maxZoom;       
   };

   /**
    * 设置聚合的最大缩放级别
    * @param {Number} maxZoom 聚合的最大缩放级别
    * @return 无返回值
    */
   MarkerClusterer.prototype.setMaxZoom = function(maxZoom) {
       this._maxZoom = maxZoom;
       this._redraw();
   };

   /**
    * 获取聚合的样式风格集合
    * @return {Array<IconStyle>} 聚合的样式风格集合
    */
   MarkerClusterer.prototype.getStyles = function() {
       return this._styles;
   };

   /**
    * 设置聚合的样式风格集合
    * @param {Array<IconStyle>} styles 样式风格数组
    * @return 无返回值
    */
   MarkerClusterer.prototype.setStyles = function(styles) {
       this._styles = styles;
       this._redraw();
   };

   /**
    * 获取单个聚合的最小数量。
    * @return {Number} 单个聚合的最小数量。
    */
   MarkerClusterer.prototype.getMinClusterSize = function() {
       return this._minClusterSize;
   };

   /**
    * 设置单个聚合的最小数量。
    * @param {Number} size 单个聚合的最小数量。
    * @return 无返回值。
    */
   MarkerClusterer.prototype.setMinClusterSize = function(size) {
       this._minClusterSize = size;
       this._redraw();
   };

   /**
    * 获取单个聚合的落脚点是否是聚合内所有标记的平均中心。
    * @return {Boolean} true或false。
    */
   MarkerClusterer.prototype.isAverageCenter = function() {
       return this._isAverageCenter;
   };

   /**
    * 获取聚合的Map实例。
    * @return {Map} Map的示例。
    */
   MarkerClusterer.prototype.getMap = function() {
       return this._map;
   };

   /**
    * 获取所有的标记数组。
    * @return {Array<Marker>} 标记数组。
    */
   MarkerClusterer.prototype.getMarkers = function() {
       return this._markers;
   };

   /**
    * 获取聚合的总数量。
    * @return {Number} 聚合的总数量。
    */
   MarkerClusterer.prototype.getClustersCount = function() {
       var count = 0;
       for(var i = 0, cluster; cluster = this._clusters[i]; i++){
           cluster.isReal() && count++;     
       }
       return count;
   };

   /**
    * @ignore
    * Cluster
    * @class 表示一个聚合对象，该聚合，包含有N个标记，这N个标记组成的范围，并有予以显示在Map上的TextIconOverlay等。
    * @constructor
    * @param {MarkerClusterer} markerClusterer 一个标记聚合器示例。
    */
   function Cluster(markerClusterer){
       this._markerClusterer = markerClusterer;
       this._map = markerClusterer.getMap();
       this._minClusterSize = markerClusterer.getMinClusterSize();
       this._isAverageCenter = markerClusterer.isAverageCenter();
       this._center = null;//落脚位置
       this._markers = [];//这个Cluster中所包含的markers
       this._gridBounds = null;//以中心点为准，向四边扩大gridSize个像素的范围，也即网格范围
       this._isReal = false; //真的是个聚合

       this._clusterMarker = new TextIconOverlay(this._center, this._markers.length, {"styles":this._markerClusterer.getStyles()});
       //this._map.addOverlay(this._clusterMarker);
   }

   /**
    * 向该聚合添加一个标记。
    * @param {Marker} marker 要添加的标记。
    * @return 无返回值。
    */
   Cluster.prototype.addMarker = function(marker){
       if(this.isMarkerInCluster(marker)){
           return false;
       }//也可用marker.isInCluster判断,外面判断OK，这里基本不会命中

       if (!this._center){
           this._center = marker.getPosition();
           this.updateGridBounds();//
       } else {
           if(this._isAverageCenter){
               var l = this._markers.length + 1;
               var lat = (this._center.lat * (l - 1) + marker.getPosition().lat) / l;
               var lng = (this._center.lng * (l - 1) + marker.getPosition().lng) / l;
               this._center = new BMap.Point(lng, lat);
               this.updateGridBounds();
           }//计算新的Center
       }

       marker.isInCluster = true;
       this._markers.push(marker);

       var len = this._markers.length;
       if(len < this._minClusterSize ){     
           this._map.addOverlay(marker);
           //this.updateClusterMarker();
           return true;
       } else if (len === this._minClusterSize) {
           for (var i = 0; i < len; i++) {
               this._markers[i].getMap() && this._map.removeOverlay(this._markers[i]);
           }
           
       } 
       this._map.addOverlay(this._clusterMarker);
       this._isReal = true;
       this.updateClusterMarker();
       return true;
   };

   /**
    * 判断一个标记是否在该聚合中。
    * @param {Marker} marker 要判断的标记。
    * @return {Boolean} true或false。
    */
   Cluster.prototype.isMarkerInCluster= function(marker){
       if (this._markers.indexOf) {
           return this._markers.indexOf(marker) != -1;
       } else {
           for (var i = 0, m; m = this._markers[i]; i++) {
               if (m === marker) {
                   return true;
               }
           }
       }
       return false;
   };

   /**
    * 判断一个标记是否在该聚合网格范围中。
    * @param {Marker} marker 要判断的标记。
    * @return {Boolean} true或false。
    */
   Cluster.prototype.isMarkerInClusterBounds = function(marker) {
       return this._gridBounds.containsPoint(marker.getPosition());
   };

   Cluster.prototype.isReal = function(marker) {
       return this._isReal;
   };

   /**
    * 更新该聚合的网格范围。
    * @return 无返回值。
    */
   Cluster.prototype.updateGridBounds = function() {
       var bounds = new BMap.Bounds(this._center, this._center);
       this._gridBounds = getExtendedBounds(this._map, bounds, this._markerClusterer.getGridSize());
   };

   /**
    * 更新该聚合的显示样式，也即TextIconOverlay。
    * @return 无返回值。
    */
   Cluster.prototype.updateClusterMarker = function () {
       if (this._map.getZoom() > this._markerClusterer.getMaxZoom()) {
           this._clusterMarker && this._map.removeOverlay(this._clusterMarker);
           for (var i = 0, marker; marker = this._markers[i]; i++) {
               this._map.addOverlay(marker);
           }
           return;
       }

       if (this._markers.length < this._minClusterSize) {
           this._clusterMarker.hide();
           return;
       }

       this._clusterMarker.setPosition(this._center);
       
       this._clusterMarker.setText(this._markers.length);

       var thatMap = this._map;
       var thatBounds = this.getBounds();
       this._clusterMarker.addEventListener("click", function(event){
           thatMap.setViewport(thatBounds);
       });

   };

   /**
    * 删除该聚合。
    * @return 无返回值。
    */
   Cluster.prototype.remove = function(){
       for (var i = 0, m; m = this._markers[i]; i++) {
               this._markers[i].getMap() && this._map.removeOverlay(this._markers[i]);
       }//清除散的标记点
       this._map.removeOverlay(this._clusterMarker);
       this._markers.length = 0;
       delete this._markers;
   }

   /**
    * 获取该聚合所包含的所有标记的最小外接矩形的范围。
    * @return {BMap.Bounds} 计算出的范围。
    */
   Cluster.prototype.getBounds = function() {
       var bounds = new BMap.Bounds(this._center,this._center);
       for (var i = 0, marker; marker = this._markers[i]; i++) {
           bounds.extend(marker.getPosition());
       }
       return bounds;
   };

   /**
    * 获取该聚合的落脚点。
    * @return {BMap.Point} 该聚合的落脚点。
    */
   Cluster.prototype.getCenter = function() {
       return this._center;
   };

   return MarkerClusterer;

}));