!function(a){var b={},c={};c.attachEvent=function(b,c,d){return"addEventListener"in a?b.addEventListener(c,d,!1):void 0},c.fireFakeEvent=function(a,b){return document.createEvent?a.target.dispatchEvent(c.createEvent(b)):void 0},c.createEvent=function(b){if(document.createEvent){var c=a.document.createEvent("HTMLEvents");return c.initEvent(b,!0,!0),c.eventName=b,c}},c.getRealEvent=function(a){return a.originalEvent&&a.originalEvent.touches&&a.originalEvent.touches.length?a.originalEvent.touches[0]:a.touches&&a.touches.length?a.touches[0]:a};var d=[{test:("propertyIsEnumerable"in a||"hasOwnProperty"in document)&&(a.propertyIsEnumerable("ontouchstart")||document.hasOwnProperty("ontouchstart")),events:{start:"touchstart",move:"touchmove",end:"touchend"}},{test:a.navigator.msPointerEnabled,events:{start:"MSPointerDown",move:"MSPointerMove",end:"MSPointerUp"}},{test:a.navigator.pointerEnabled,events:{start:"pointerdown",move:"pointermove",end:"pointerup"}}];b.options={eventName:"tap",fingerMaxOffset:11};var e,f,g,h,i={};e=function(a){return c.attachEvent(document.body,h[a],g[a])},g={start:function(a){a=c.getRealEvent(a),i.start=[a.pageX,a.pageY],i.offset=[0,0]},move:function(a){return i.start||i.move?(a=c.getRealEvent(a),i.move=[a.pageX,a.pageY],void(i.offset=[Math.abs(i.move[0]-i.start[0]),Math.abs(i.move[1]-i.start[1])])):!1},end:function(d){if(d=c.getRealEvent(d),i.offset[0]<b.options.fingerMaxOffset&&i.offset[1]<b.options.fingerMaxOffset&&!c.fireFakeEvent(d,b.options.eventName)){if(a.navigator.msPointerEnabled||a.navigator.pointerEnabled){var e=function(a){a.preventDefault(),d.target.removeEventListener("click",e)};d.target.addEventListener("click",e,!1)}d.preventDefault()}i={}},click:function(a){return c.fireFakeEvent(a,b.options.eventName)?void 0:a.preventDefault()}},f=function(){for(var a=0;a<d.length;a++)if(d[a].test)return h=d[a].events,e("start"),e("move"),e("end"),!1;return c.attachEvent(document.body,"click",g.click)},c.attachEvent(a,"load",f),a.Tap=b}(window);

(function($){

    $.fn.mdater = function(config){
		var defaults = {
			maxDate : null,
			minDate : new Date(1970, 0, 1),
            // 日期关联数据 [{ date: string, value: object }, ... ]
            // 日期格式与 format 一致
            // 如 [ {date: '2015/11/23', value: '面试'} ]
            data: null,
			onSelected:function (date, week) {
            }
		};
		var option = $.extend(defaults, config);
		console.log(option.data.length)

		var input = this;

		//通用函数
		var F = {
			//计算某年某月有多少天
			getDaysInMonth : function(year, month){
			    return new Date(year, month+1, 0).getDate();
			},
			//计算某月1号是星期几
			getWeekInMonth : function(year, month){
				return new Date(year, month, 1).getDay();
			},
			getMonth : function(m){
				return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'][m];
			},
			//计算年某月的最后一天日期
			getLastDayInMonth : function(year, month){
				return new Date(year, month, this.getDaysInMonth(year, month));
			},
            // djy add start
            //计算某天是周几
			getWeekDay: function (date) {
                //dayValue=“2014-01-01”
                var day = new Date(Date.parse(date.replace(/-/g, '/'))); //将日期值格式化
                var today = new Array("星期日","星期一","星期二","星期三","星期四","星期五","星期六"); //创建星期数组
                return today[day.getDay()];  //返一个星期中的某一天，其中0为星期日
            }
            // djy add end
		};

        // djy add start
        Date.prototype.format = function(fmt) {
            var o = {
                "M+" : this.getMonth()+1,                 //月份
                "d+" : this.getDate(),                    //日
                "h+" : this.getHours(),                   //小时
                "m+" : this.getMinutes(),                 //分
                "s+" : this.getSeconds(),                 //秒
                "q+" : Math.floor((this.getMonth()+3)/3), //季度
                "S"  : this.getMilliseconds()             //毫秒
            };
            if(/(y+)/.test(fmt)) {
                fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
            }
            for(var k in o) {
                if(new RegExp("("+ k +")").test(fmt)){
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                }
            }
            return fmt;
        }
        $.fn.changeData = function(data) {
            option.data = data;
            mdater.refreshView();
        }
        $.fn.direction = function(direction) {
            var add;
            if(direction == "left"){
                add = -1;
            }else {
                add = 1;
            }
            console.log(add)
            mdater._changeMonth(add);
        }
        $.fn.getNowDate = function() {
        	var data = new Date().format("yyyy-MM-dd");
        	option.onSelected(new Date().format("yyyy.MM.dd"), F.getWeekDay(data));

        },
        $.fn.initListeners = function() {
            mdater.initListeners();
        }
        // djy add end

		//为$扩展一个方法，以配置的方式代理事件
		$.fn.delegates = function(configs) {
		    el = $(this[0]);
		    for (var name in configs) {
		        var value = configs[name];
		        if (typeof value == 'function') {
		            var obj = {};
		            obj.tap = value;
		            value = obj;
		        };
		        for (var type in value) {
		            el.delegate(name, type, value[type]);
		        }
		    }
		    return this;
		}

		var mdater = {
			value : {
				year : '',
				month : '',
				date : ''
			},
			lastCheckedDate : '',
			init : function(){
				this.renderHTML();
				// this.initListeners();
                this._showPanel();
			},
			renderHTML : function(){
				var $html = $('<div class="md_container">' +
					'<div class="md_panel"><div class="md_head"><div class="md_selectarea"><a class="md_prev change_year" href="javascript:void(0);">&lt;</a> <a class="md_headtext yeartag" href="javascript:void(0);"></a> ' +
					'<a class="md_next change_year" href="javascript:void(0);">&gt;</a></div>' +
					'<div class="md_selectarea">' +
					'<a class="md_prev change_month" href="javascript:void(0);">&lt;</a>' +
					' <a class="md_headtext monthtag" href="javascript:void(0);">月</a> ' +
					'<a class="md_next change_month" href="javascript:void(0);">&gt;</a>' +
					'</div></div>' +
					'<div class="md_body">' +
					'<ul class="md_weekarea"><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li><li>日</li></ul>' +
					'<ul class="md_datearea in"></ul></div>' +
					'<div class="md_foot"></div>' +
					'</div>' +
					'</div>');

				$("#container").append($html);
			},
			_showPanel : function(container){
				this.refreshView();
				$('.md_panel, .md_mask').addClass('show');
			},
			_hidePanel : function(){
				$('.md_panel, .md_mask').removeClass('show');
			},
			_changeMonth : function(add, checkDate){

				//先把已选择的日期保存下来
				this.saveCheckedDate();

				var monthTag = $('.md_selectarea').find('.monthtag'),
					num = ~~monthTag.data('month')+add;
				//月份变动发生了跨年
				if(num>11){
					num = 0;
					this.value.year++;
					$('.yeartag').text(this.value.year).data('year', this.value.year);
				}
				else if(num<0){
					num = 11;
					this.value.year--;
					$('.yeartag').text(this.value.year).data('year', this.value.year);
				}

				var nextMonth = F.getMonth(num)+'月';
				monthTag.text(nextMonth).data('month', num);
				this.value.month = num;
				if(checkDate){
					this.value.date = checkDate;
				}
				else{
					//如果有上次选择的数据，则进行赋值
					this.setCheckedDate();
				}
				this.updateDate(add);
			},
			_changeYear : function(add){
				//先把已选择的日期保存下来
				this.saveCheckedDate();

				var yearTag = $('.md_selectarea').find('.yeartag'),
					num = ~~yearTag.data('year')+add;
                yearTag.text(num).data('year', num);
				this.value.year = num;
				
				this.setCheckedDate();

				this.updateDate(add);
			},
			//保存上一次选择的数据
			saveCheckedDate : function(){
				if(this.value.date){
					this.lastCheckedDate = {
						year : this.value.year,
						month : this.value.month,
						date : this.value.date
					}
				}
			},
			//将上一次保存的数据恢复到界面
			setCheckedDate : function(){
				if(this.lastCheckedDate && this.lastCheckedDate.year==this.value.year && this.lastCheckedDate.month==this.value.month){
					this.value.date = this.lastCheckedDate.date;
				}
				else{
					this.value.date = '';
				}
			},
			//根据日期得到渲染天数的显示的HTML字符串
			getDateStr : function(y, m, d){
				var dayStr = '';
				//计算1号是星期几，并补上上个月的末尾几天
				var week = F.getWeekInMonth(y, m) == 0? 7: F.getWeekInMonth(y, m);
				var lastMonthDays = F.getDaysInMonth(y, m-1);

                // djy change start
				for(var j=week-2; j>=0; j--){
					dayStr += '<li class="prevdate" data-day="'+(lastMonthDays-j)+'">'+(lastMonthDays-j)+'</li>';
				}
                // djy change end

				//再补上本月的所有天;
				var currentMonthDays = F.getDaysInMonth(y, m);
				//判断是否超出允许的日期范围
				var startDay = 1,
					endDay = currentMonthDays, 
					thisDate = new Date(y, m, d),
					firstDate = new Date(y, m, 1);
					lastDate =  new Date(y, m, currentMonthDays),
					minDateDay = option.minDate.getDate();
					

				if(option.minDate>lastDate){
					startDay = currentMonthDays+1;
				}
				else if(option.minDate>=firstDate && option.minDate<=lastDate){
					startDay = minDateDay;
				}

				if(option.maxDate){
					var maxDateDay = option.maxDate.getDate();
					if(option.maxDate<firstDate){
						endDay = startDay-1;
					}
					else if(option.maxDate>=firstDate && option.maxDate<=lastDate){
						endDay = maxDateDay;
					}
				}
				

				//将日期按允许的范围分三段拼接
				for(var i=1; i<startDay; i++){
					dayStr += '<li class="disabled" data-day="'+i+'">'+i+'</li>';
				}
				for(var j=startDay; j<=endDay; j++){
					var current = '';
					if(y==this.value.year && m==this.value.month && d==j){
						current = 'current';
					}

                    // djy add start
                    var markData = option.data;
                    if (markData) {
                        for (var i = 0, len = markData.length; i < len; i++) {
                            var item = markData[i];
							var arr = item.date.split("/");

                            if(this.value.year==arr[0] && this.value.month==arr[1]-1 && j==arr[2]){
                                if(item.type == 0)
                                    current = 'current2';
                                else
                                    current = 'current3';
                            }
                        }
                    }

                    dayStr += '<li class="'+current+'" data-day="'+j+'">'+j+'</li>';
                    // djy add end
				}
				for(var k=endDay+1; k<=currentMonthDays; k++){
					dayStr += '<li class="disabled" data-day="'+k+'">'+k+'</li>';
				}

				//再补上下个月的开始几天

                // djy change start
				var nextMonthStartWeek = (currentMonthDays + F.getWeekInMonth(y, m)) % 7;
                if(nextMonthStartWeek ==0){
					var i = 1;
                    dayStr += '<li class="nextdate" data-day="'+i+'">'+i+'</li>';
                }else {
                    if(nextMonthStartWeek!=1){
                        for(var i=1; i<=8-nextMonthStartWeek; i++){

                            dayStr += '<li class="nextdate" data-day="'+i+'">'+i+'</li>';
                        }
                    }
				}
                // djy change end

				return dayStr;
			},
			updateDate : function(add){
				var dateArea = $('.md_datearea.in');

				if(add == 1){
					var c1 = 'out_left';
					var c2 = 'out_right';
				}
				else{
					var c1 = 'out_right';
					var c2 = 'out_left';	
				}
				var newDateArea = $('<ul class="md_datearea '+c2+'"></ul>');
				newDateArea.html(this.getDateStr(this.value.year, this.value.month, this.value.date));
				$('.md_body').append(newDateArea);
				setTimeout(function(){
					newDateArea.removeClass(c2).addClass('in');
					dateArea.removeClass('in').addClass(c1);
				}, 10);
                // djy add start
                console.log(newDateArea.height())
                $('.md_body').height(newDateArea.height());
                // djy add end
			},
			//每次调出panel前，对界面进行重置
			refreshView : function(){
				var initVal = input.val(),
					date = null;
				if(initVal){
					var arr = initVal.split('-');
					date = new Date(arr[0], arr[1]-1 , arr[2]);
				}
				else{
					date = new Date();
				}
				var y = this.value.year = date.getFullYear(),
					m = this.value.month = date.getMonth(),
					d = this.value.date = date.getDate();
				$('.yeartag').text(y).data('year', y);
				$('.monthtag').text(F.getMonth(m)+'月').data('month', m);
				var dayStr = this.getDateStr(y, m, d);
				$('.md_datearea').html(dayStr);

				// djy add start
				console.log($('.md_datearea').height())
                $('.md_body').height($('.md_datearea').height());
				// djy add end
			},
			initListeners : function(){
				var panel = $('.md_panel'),
					// mask = $('.md_mask'),
					_this = this;

				panel.delegates({
					'.change_month' : function(){
						var add = $(this).hasClass('md_next') ? 1 : -1;
						_this._changeMonth(add);
					},
					'.change_year' : function(){
						var add = $(this).hasClass('md_next') ? 1 : -1;
						_this._changeYear(add);	
					},
					'.out_left, .out_right' : {
						'webkitTransitionEnd' : function(){
							$(this).remove();
						}
					},
					'.md_datearea li' : function(){
						var $this = $(this);
						if($this.hasClass('disabled')){
							return;
						}
						_this.value.date = $this.data('day');
						//判断是否点击的是前一月或后一月的日期
						var add = 0;
						if($this.hasClass('nextdate')){
							add = 1;
						}
						else if($this.hasClass('prevdate')){
							add = -1;
						}

						if(add !== 0){
							_this._changeMonth(add, _this.value.date);
						}
						else{
							$this.addClass('current').siblings('.current').removeClass('current');
						}
                        var monthValue = ~~_this.value.month + 1;
                        if(monthValue < 10){
                            monthValue = '0' + monthValue;
                        }
                        var dateValue = _this.value.date;
                        if(dateValue === ''){
                            dateValue = _this.value.date = 1;
                        }
                        if(dateValue < 10){
                            dateValue = '0' + dateValue;
                        }
                        option.onSelected(_this.value.year + '.' + monthValue + '.' + dateValue, F.getWeekDay(_this.value.year + '-' + monthValue + '-' + dateValue))
					},

				});

			}
		}
		mdater.init();
	}
})(Zepto);