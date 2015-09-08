(function(window, document) {
    var document = window.document,
        support = {
            transform3d: ("WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix()),
            touch: ("ontouchstart" in window)
        };

    var myScroll;

    var unit = {
        isApp: function () {
            var ua = navigator.userAgent,
                arr = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
                flag = false;

            for (var v = 0; v < arr.length; v++) {  
                if (ua.indexOf(arr[v]) > 0) { 
                    flag = true;
                    break;
                }  
            }

            return flag;
        },

        getScreen: function () {
            return obj = {
                x: $(document.body).width(),
                y: $(document.body).height()
            };
        },

        getRequest: function () { 
            var url = location.search,
                obj = {}; 

            if (url.indexOf("?") != -1) { 
                var str = url.substr(1); 
                strs = str.split("&"); 
                for(var i = 0; i < strs.length; i++) { 
                    obj[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]); 
                } 
            } 

            return obj; 
        },

        addEvent: function (el, type, fn) {
            el.addEventListener(type, fn, false);
        },

        removeEvent: function (el, type, fn) {
            el.removeEventListener(type, fn, false);
        },

        getPage: function (event, page) {
            return event.changedTouches[0][page];
        },

        getTranslate: function (x, y) {
            var distX = x,
                distY = y;

            return support.transform3d ? "translate3d(" + distX + "px, " + distY + "px, 0)" : "translate(" + distX + "px, " + distY + "px)";
        },

        eventStop: function (e) {
            e.preventDefault();
            e.stopPropagation();
        },

        getTriangleSide: function(x1, y1, x2, y2) {
            var x = Math.abs(x1 - x2),
                y = Math.abs(y1 - y2),
                z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

            return {
                x: x,
                y: y,
                z: z
            };
        },

        getAngle: function (triangle) {
            var cos = triangle.y / triangle.z,
                radina = Math.acos(cos);

            return 180 / (Math.PI / radina);
        }
    };

    /**
     * 定义页面中出现的 DOM结构元素
     */
    var $view        = $("#js_view"),
        $tbody       = $("#js_tbody"),
        $video       = $("#js_video"),
        $app         = $("#js_app"),
        $detail      = $("#js_detail"),
        $pdf         = $("#js_pdf"),
        $about       = $("#js_about"),
        $msg         = $("#js_msg"),
        $icon        = $("#js_icon"),
        $mod_wrapper = $(".mod_wrapper");

    var current = 0;


    var app = {
        init: function () {
            var self = this;

            self.wrapper = document.querySelector("#js_view");
            self.newX = 0;
            self.newY = 0;
            self.img = 0;
            self.type = "y"; // y：直线移动，x：横向移动

            self._initEvents();
        },

        _start: function (e) {
            var self = this;
            
            unit.eventStop(e);

            self.basePageX = unit.getPage(e, "pageX");
            self.basePageY = unit.getPage(e, "pageY");

            self.scrolling = true;
            self.moveReady = false;
        },

        _move: function (e) {
            var self = this;
            
            unit.eventStop(e);

            if (!self.scrolling) {
                return;
            }

            var pageX = unit.getPage(e, "pageX"),
                pageY = unit.getPage(e, "pageY"),
                distX,
                distY,
                moveX = 0,
                moveY = 0;

            if (self.moveReady) {

                distX = pageX - self.basePageX;
                distY = pageY - self.basePageY;

                self.moveX = distX;
                self.moveY = distY;

                if (self.type == "x") {
                    if (self.img > 0 && self.img < 3) {
                        moveX = distX + self.newX;
                    } else {
                        moveX = distX/3 + self.newX;
                    }
                    moveY = 0;
                } else {
                    moveX = 0;
                    if (current > 0 && current < 3) {
                        moveY = distY + self.newY;
                    } else {
                        moveY = distY/3 + self.newY;
                    }
                }

                self._refresh({
                    'e': e,
                    'x': moveX,
                    'y': moveY,
                    'timer': '0s',
                    'type': 'ease'
                });


            } else {
                var triangle = unit.getTriangleSide(self.basePageX, self.basePageY, pageX, pageY);

                if (current == 2) {
                    if (self.moveY < -100 || self.moveY > 100) {
                        self.type = "y";
                    } else {
                        self.type = "x";
                    }
                     
                    self.moveReady = true;
                    // } else {
                    //     self.scrolling = false;
                    // }

                } else {
                    self.type = "y";
                    if (triangle.z > 5) {
                        if (unit.getAngle(triangle) < 20) {
                            self.moveReady = true;
                        } else {
                            self.scrolling = false;
                        }
                    }
                }
            }
        },

        _end: function (e) {
            var self = this;

            if (!self.scrolling) return;

            if (self.type == "y") {
                if (self.moveY < 0) {
                    if (self.moveY < -80) {
                        if (current < 3) {
                            current++;
                        }
                    }
                } else {
                    if (self.moveY > 80) {
                        if (current > 0) {
                            current--;
                        }
                    }
                }

                self._refresh({
                    'e': e,
                    'x': 0,
                    'y': - current * unit.getScreen().y,
                    'timer': '0.5s',
                    'type': 'ease-in-out'
                });

                self.newY = -current * unit.getScreen().y;
            } else {
                if (self.moveX < 0) {
                    if (self.moveX < -80) {
                        if (self.img < 3) {
                            self.img++;
                        }
                    }
                } else {
                    if (self.moveX > 80) {
                        if (self.img > 0) {
                            self.img--;
                        }
                    }
                }

                self._refresh({
                    'e': e,
                    'x': - self.img * unit.getScreen().x,
                    'y': 0,
                    'timer': '0.5s',
                    'type': 'ease-in-out'
                });

                self.newX = -self.img * unit.getScreen().x;

                self._changedCurrent();
            }

            if (current == 3) {
                self.updatePdf();
            } else {
                $(".js_footer").hide();
            }
        },

        updatePdf: function () {
            $(".js_footer").show();

            $("#js_pdf .t_img > img").css({
                "height": ($("#js_pdf .t_img").height() - 60)+"px"
            });
        },

        _refresh: function (params) {
            var self = this;

            if (self.type == "x") {
                $(".js_slide").css({
                    "-webkit-transition": "-webkit-transform "+ params.timer +" "+ params.type,
                    "-webkit-transform": unit.getTranslate(params.x, 0)
                });
            } else {
                $("#js_tbody").css({
                    "-webkit-transition": "-webkit-transform "+ params.timer +" "+ params.type,
                    "-webkit-transform": unit.getTranslate(0, params.y)
                });
            }
        },

        _changedCurrent: function() {
            var self = this,
                $that = $("#t_pointer p");

            $that.removeClass("current");
            $that.eq(self.img).addClass("current");
        },

        _initEvents: function (remove) {
            var eventType = remove ? unit.removeEvent : unit.addEvent;

            eventType(this.wrapper, 'touchstart', this);
            eventType(this.wrapper, 'touchmove', this);
            eventType(this.wrapper, 'touchend', this);
        },

        handleEvent: function (e) {
            var self = this;

            switch (e.type) {
                case 'touchstart':
                    self._start(e);
                break;
                case 'touchmove':
                    self._move(e);
                break;
                case 'touchend':
                    self._end(e);
                break;
            }
        },

        _clickMenu: function () {
            var self = this;
            $(".js_menu li").off().on("click", function (e) {
                current = $(this).index();

                self.moveView();
            });
        },

        moveView: function () {
            var self = this;

            $(".js_footer").hide();

            self.newY = -current * unit.getScreen().y;

            self._refresh({
                'x': 0,
                'y': - current * unit.getScreen().y,
                'timer': '0.5s',
                'type': 'ease-in-out'
            });

            if (current == 3) {
                self.updatePdf();
                $(".js_footer").show();
            }
        }
    };



    var fn = {
        init: function () {
            var self = this;


            var params = unit.getRequest();

            if (params.tab) {
                current = parseInt(params.tab, 0) || 0;
            }

            if (current > 3) {
                current = 0;
            }

            if (!unit.isApp()) {
                self.animate();

                $("#js_view").off().on('mousewheel', function(e) {
                    // console.log(e.deltaX, e.deltaY, e.deltaFactor);
                    if ((e.deltaY > 2) && (current < 3) && !$tbody.is(":animated")) {
                        current++;
                        self.animate();
                    }

                    if ((e.deltaY < -2) && (current > 0) && !$tbody.is(":animated")) {
                        current--;
                        self.animate();
                    }
                });
            } else {

                app.moveView();
                // var type = "video";

                // switch (current) {
                //     case "1":
                //         type = "app";
                //     break;
                    
                //     case "2":
                //         type = "detail";
                //     break;
                    
                //     case "3":
                //         type = "pdf";
                //     break;
                // }

                // self._appMove(type);
                // $("#js_"+ type).show();
            }
        },

        /**
         * 初始化页面中的view表现
         * 需要判断环境
         */
        setView: function (type) {
            var self = this;
            
            self.toggleMenu();

            if (!unit.isApp()) {
                $("body").addClass("view_web");
                self.clickScroll();

                self._footer();
                self.setWeb();
            } else {
                $("body").addClass("view_app");
                self.setApp();

                if (!type || type != "no") {
                    app.init();
                }
            }
        },

        toggleMenu: function () {
            $(".js_menu").off().on("click", function () {
                var $that = $(".js_menu ul");
                if($that.hasClass("show")) {
                    $that.removeClass("show");
                } else {
                    $that.addClass("show");
                }
            });
        },

        clickScroll: function () {
            var self = this;

            $(".js_menu li").on("click", function () {
                var index = $(this).index();

                if (index == 4) {
                    $(".mod_footer").show();
                } else {
                    current = index;
                    $(".mod_footer").hide();
                    self.animate();
                }
            });
        },

        animate: function () {
            $("#js_icon li").removeClass("current");

            $tbody.animate({
                top: -unit.getScreen().y*current + "px"
            });

            $(".js_footer").hide();

            $("#js_icon li").eq(current).addClass("current");
            if (current == 3) {
                $(".mod_footer").show();
            }
        },

        _footer: function () {
            var self = this;

            $(".js_footer li").off().on("click", function () {
                var type = $(this).attr("data-type");

                $(".js_footer").hide();
                // $(".js_mod").hide();
                $("#js_"+type).show();
            });
        },

        setWeb: function () {
            var self = this;

            var $screen = unit.getScreen();

            $view.css({
                "width": $screen.x + "px",
                "height": $screen.y + "px"
            });
            $video.css({
                "width": $screen.x + "px",
                "height": $screen.y + "px"
            });
            $app.css({
                "width": $screen.x + "px",
                "height": $screen.y + "px"
            });
            $detail.css({
                "width": $screen.x + "px",
                "height": $screen.y + "px"
            });
            $pdf.css({
                "width": $screen.x + "px",
                "height": $screen.y + "px"
            });
            $about.css({
                "width": $screen.x + "px",
                "height": $screen.y + "px"
            });
            $msg.css({
                "width": $screen.x + "px",
                "height": $screen.y + "px"
            });

            $tbody.css({
                "height": $screen.y*4 + "px"
            });

            $mod_wrapper.css({
                "height": ($screen.y-90)+"px"
            });

            $icon.css({
                "right": ($screen.x-980)/2 + "px"
            })

            self.setDetail();
        },

        setDetail: function () {
            var self = this;

            $(".js_slide li").css({"height": (unit.getScreen().y - 90 - 50)+"px"});

            var img = {
                    x: 372,
                    y: 663
                },
                h = unit.getScreen().y - 90 - 50 - 40,
                ih = Math.floor(250/372 * 663);

            if (h >= ih) {
                $(".js_slide img").css({
                    "width": "220px",
                    "margin-left": "-110px"
                });
            } else {
                $(".js_slide img").css({
                    "height": (h-20) + "px",
                    "margin-left": -((h-20)/img.y)*img.x/2 + "px"
                });
            }
        },

        setApp: function () {
            var self = this;

            $(".js_mod").css({
                "width": unit.getScreen().x + "px",
                "height": unit.getScreen().y + "px"
            });

            // self._appMenu();
            app._clickMenu();

            self._appImages();
        },

        _appMenu: function () {
            var self = this;
            $(".js_menu li").off().on("click", function (e) {
                // var type = $(this).data("type");
                var index = $(this).index();
                $(".js_footer").hide();

                // self._appMove(type);
                app._refresh({
                    'e': e,
                    'x': - self.img * unit.getScreen().x,
                    'y': 0,
                    'timer': '0.5s',
                    'type': 'ease-in-out'
                });
            });
        },

        _appType: function (type) {
            var num = 0;

            switch (type) {
                case "video":
                    num = 0;
                break;

                case "app":
                    num = 1;
                break;

                case "detail":
                    num = 2;
                break;

                case "pdf":
                    num = 3;
                break;
            }

            return num;
        },

        _appMove: function (type) {
            var self = this;

            $tbody.animate({
                top: -unit.getScreen().y* self._appType(type) + "px"
            });

            if (type == "pdf") {
                $(".js_footer").show();

                $("#js_pdf .t_img > img").css({
                    "height": ($("#js_pdf .t_img").height() - 60)+"px"
                });
            }

            if (type == "detail") {
                // myScroll = new IScroll('.js_slide', {
                //     scrollX: true,
                //     scrollY: false,
                //     momentum: false,
                //     snap: true,
                //     snapSpeed: 400,
                //     keyBindings: true,
                //     indicators: {
                //         el: document.getElementById('t_pointer'),
                //         resize: false
                //     }
                // });
                // self._appSlide();
            }
        },

        // _appSlide: function () {
        //     myScroll = new IScroll('.js_slide', {
        //         scrollX: true,
        //         scrollY: false,
        //         momentum: false,
        //         snap: true,
        //         snapSpeed: 400,
        //         keyBindings: true,
        //         indicators: {
        //             el: document.getElementById('t_pointer'),
        //             resize: false
        //         }
        //     });
        // },

        _appImages: function () {
            $(".js_slide ul li").css({
                "width": unit.getScreen().x + "px"
            });
            $(".js_slide ul").css({
                "display": "-webkit-box"
            });
        }
    };

    window.fn = fn;

})(window, document);