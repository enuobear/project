(function(window){
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

    var fn = {
        init: function () {
            var self = this;


            var params = unit.getRequest();

            if (params.tab) {
                current = params.tab;
            }

            if (!unit.isApp()) {
                self.animate();

                $("#js_view").on('mousewheel', function(e) {
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
                var type = "video";

                switch (current) {
                    case "1":
                        type = "app";
                    break;
                    
                    case "2":
                        type = "detail";
                    break;
                    
                    case "3":
                        type = "pdf";
                    break;
                }

                self._appMove(type);
                // $("#js_"+ type).show();
            }
        },

        /**
         * 初始化页面中的view表现
         * 需要判断环境
         */
        setView: function () {
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
            }
        },

        toggleMenu: function () {
            $(".js_menu").on("click", function () {
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
            $("#js_icon li").eq(current).addClass("current");
            if (current == 3) {
                $(".mod_footer").show();
            }
        },

        _footer: function () {
            var self = this;

            $(".js_footer li").on("click", function () {
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

            self._appMenu();

            self._appImages();
        },

        _appMenu: function () {
            var self = this;
            $(".js_menu li").on("click", function () {
                var type = $(this).data("type");

                // if (type == "about") {
                //     $(".js_footer").show();
                // } else {
                //     $(".js_footer").hide();
                //     // $(".js_mod").hide();
                //     $("#js_"+type).show();
                // }
                $(".js_footer").hide();

                self._appMove(type);
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
                myScroll = new IScroll('.js_slide', {
                    scrollX: true,
                    scrollY: false,
                    momentum: false,
                    snap: true,
                    snapSpeed: 400,
                    keyBindings: true,
                    indicators: {
                        el: document.getElementById('t_pointer'),
                        resize: false
                    }
                });
            }
        },

        _appImages: function () {
            $(".js_slide ul li").css({
                "width": unit.getScreen().x + "px"
            });
            $(".js_slide ul").css({
                "display": "-webkit-box"
            });
        }
    };


    fn.setView();


    window.fn = fn;

})(window);