(function(){
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
        $mod_wrapper = $(".mod_wrapper");


    var fn = {
        /**
         * 初始化页面中的view表现
         * 需要判断环境
         */
        setView: function () {
            var self = this;

            self.toggleMenu();

            if (!unit.isApp()) {
                $("body").addClass("view_web");
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

            $tbody.css({
                "height": $screen.y*4 + "px",
                "top": -$screen.y*3 +"px"
            });

            $mod_wrapper.css({
                "height": ($screen.y-90)+"px"
            });

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

        }
    };


    fn.setView();



})();



$(window).on('scroll', function () {
    var $that = $('.top_tab'),
        top = $that.offset().top,
        stop = $('body').scrollTop();

    if ((top - stop) <= 60) {
        $that.addClass("t_fixed");
    } else {
        $that.removeClass("t_fixed");
    }
    console.log(top - stop);
});


// (function() {
//     var slide = {
//         showDom: function () {
//             var $width = $(document.body).width();

//             $(".js_slide ul li").css({
//                 "width": $width
//             });
//             $(".js_slide ul").css({
//                 "display": "-webkit-box"
//             });
//         }
//     };

//     slide.showDom();
//     $(window).resize(function () {
//         slide.showDom();
//     });
// })();