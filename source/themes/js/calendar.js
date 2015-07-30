var Calendar = function(){};

Calendar.prototype = {
    init: function(params){
        var self = this;

        self.setConfig(params);

        // self.createHtml();

        self.addEvent();
    },

    setConfig: function(params) {
        var self = this;

        self.titleName = params.title;

        self.current = 0;

        self.newX = 0;

        self.$dom = $(params.elem).eq(params.z);

        self.$nav = self.$dom.find('.this_colgroup');

        self.w = self.$dom.find('.this_date').width();

        self.len = self.$dom.find('.this_date').length;
    },

    createHtml: function() {
        var self = this;

        var str = '';

        for (var i=0; i<self.len; i++) {
            str += '<div></div>';
        }

        self.$dom.append('<div class="this_icon">'+str+'</div>');
        
        self.$dom.find('.this_icon div').eq(0).addClass('current');
    },

    addEvent: function() {
        var self = this;

        self.$nav.on("touchstart", function(e){
            self._touchstart(e);
        });

        self.$nav.on("touchmove", function(e){
            self._touchmove(e);
        });

        self.$nav.on("touchend", function(e){
            self._touchend(e);
        });

        self._click();
    },

    _click: function(){
        var self = this;

        $('.js_month_left').on('click', function(e){
            if (!self.current) return;

            self.current--;

            self.refresh({
                'e': e,
                'x': -self.current * self.w,
                'y': 0,
                'timer': '0.5s',
                'type': 'ease-in-out'
            });

            self.changedCurrent();
        });

        $('.js_month_right').on('click', function(e){
            if (self.current >= self.len-1) return;
            self.current++;

            self.refresh({
                'e': e,
                'x': -self.current * self.w,
                'y': 0,
                'timer': '0.5s',
                'type': 'ease-in-out'
            });

            self.changedCurrent();
        });
    },

    _touchstart: function(e) {
        var self = this;

        // self.eventStop(e);
        // if (self.scrolling) {
        //     return;
        // }

        self.basePageX = self.getPage(e, "pageX");
        self.basePageY = self.getPage(e, "pageY");

        self.scrolling = true;
        self.moveReady = false;
    },

    _touchmove: function(e) {
        var self = this;

        if (!self.scrolling) {
            return;
        }

        var pageX = self.getPage(e, "pageX"),
            pageY = self.getPage(e, "pageY"),
            distX,
            distY,
            moveX = 0;

        if (self.moveReady) {

            self.eventStop(e);

            distX = pageX - self.basePageX;
            distY = pageY - self.basePageY;

            self.moveX = distX;
            self.moveY = distY;

            if (self.current > 0 && self.current < self.Len - 1) {
                moveX = distX + self.newX;
            } else {
                moveX = distX/3 + self.newX;
            }

            self.refresh({
                'e': e,
                'x': moveX,
                'y': 0,
                'timer': '0s',
                'type': 'ease'
            });

        } else {
            var triangle = self.getTriangleSide(self.basePageX, self.basePageY, pageX, pageY);

            if (triangle.z > 5) {

                if (self.getAngle(triangle) > 55) {
                    // self.eventStop(e);
                    self.moveReady = true;
                    // self.element.addEventListener('click', self, true);

                } else {

                    self.scrolling = false;

                }
            }
        }
    },

    _touchend: function(e) {
        var self = this;

        if (self.moveX < 0) {
            if (self.moveX < - 80) {
                if (self.current < self.len - 1) {
                    self.current++;
                }
            }
        } else {
            if (self.moveX > 80) {
                if (self.current > 0) {
                    self.current--;
                }
            }
        }

        self.refresh({
            'e': e,
            'x': -self.current * self.w,
            'y': 0,
            'timer': '0.5s',
            'type': 'ease-in-out'
        });

        // self.newX = -self.current * self.w;

        self.changedCurrent();
    },

    getTriangleSide: function(x1, y1, x2, y2){
        var x = Math.abs(x1 - x2),
            y = Math.abs(y1 - y2),
            z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

        return {
            x: x,
            y: y,
            z: z
        };
    },

    getAngle: function(triangle) {
        var cos = triangle.y / triangle.z,
            radina = Math.acos(cos);

        return 180 / (Math.PI / radina);
    },

    refresh: function (params) {
        var self = this;

        self.$nav.css({
            '-webkit-transition': '-webkit-transform ' + params.timer + ' ' + params.type,
            '-webkit-transform': self.getTranslate(params.x, params.y)
        });
    },

    changedCurrent: function() {
        var self = this;
        
        self.newX = -self.current * self.w;

        $('.js_month').html(self.titleName[self.current]);
    },

    eventStop: function(e){
        e.preventDefault();
        e.stopPropagation();
    },

    getTranslate: function (x, y) {
        var distX = x, distY = y;
        return "translate3d(" + distX + "px, " + distY + "px, 0)";
    },

    getPage: function (event, page) {
        return event.changedTouches[0][page];
    }
}