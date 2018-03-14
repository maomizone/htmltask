/*global $*/
/*jshint unused:false,forin:false*/
'use strict';

var opts = {
    lines: 13 // The number of lines to draw
    ,length: 28 // The length of each line
    , width: 14 // The line thickness
    , radius: 42 // The radius of the inner circle
    , scale: 0.25 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#fff' // #rgb or #rrggbb or array of colors
    , opacity: 0.25 // Opacity of the lines
    , rotate: 0 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 1 // Rounds per second
    , trail: 60 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '50%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'absolute' // Element positioning
};
var loading;

// 调用加载中
var showLoading = function (msg) {
	var txt = "加载中...";
	if(msg)
        txt = msg;

    var target = document.createElement("div");
    document.body.appendChild(target);
    var spinner = new Spinner(opts).spin(target);

    loading = iosOverlay({
        text: txt,
        // duration: 2e3,
        spinner: spinner
    });

    var top = ($(window).height() - $(".ui-ios-overlay").height())/2;
    var left = ($(window).width() - $(".ui-ios-overlay").width())/2;
    var scrollTop = $(document).scrollTop();
    var scrollLeft = $(document).scrollLeft();
    $(".ui-ios-overlay").css( { position : 'absolute', 'top' : top + scrollTop, left : left + scrollLeft } )
    $(".ui-ios-overlay").on('touchmove',function(e){
        e.preventDefault();
    })

};
// 关闭加载框
var hideLoading = function () {
    loading.hide();
};


var iosOverlay = function(params) {


	var overlayDOM;
	var noop = function() {};
	var defaults = {
		onbeforeshow: noop,
		onshow: noop,
		onbeforehide: noop,
		onhide: noop,
		text: "",
		icon: null,
		spinner: null,
		duration: null,
		id: null,
		parentEl: null
	};

	// helper - merge two objects together, without using $.extend
	var merge = function(obj1, obj2) {
		var obj3 = {};
		for (var attrOne in obj1) {
			obj3[attrOne] = obj1[attrOne];
		}
		for (var attrTwo in obj2) {
			obj3[attrTwo] = obj2[attrTwo];
		}
		return obj3;
	};

	// helper - does it support CSS3 transitions/animation
	var doesTransitions = (function() {
		var b = document.body || document.documentElement;
		var s = b.style;
		var p = 'transition';
		if (typeof s[p] === 'string') {
			return true;
		}

		// Tests for vendor specific prop
		var v = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'];
		p = p.charAt(0).toUpperCase() + p.substr(1);
		for (var i = 0; i < v.length; i++) {
			if (typeof s[v[i] + p] === 'string') {
				return true;
			}
		}
		return false;
	}());

	// setup overlay settings
	var settings = merge(defaults, params);

	//
	var handleAnim = function(anim) {
		if (anim.animationName === "ios-overlay-show") {
			settings.onshow();
		}
		if (anim.animationName === "ios-overlay-hide") {
			destroy();
			settings.onhide();
		}
	};

	// IIFE
	var create = (function() {

		// initial DOM creation and event binding
		overlayDOM = document.createElement("div");
		overlayDOM.className = "ui-ios-overlay";
		overlayDOM.innerHTML += '<span class="title">' + settings.text + '</span';
		if (params.icon) {
			overlayDOM.innerHTML += '<img src="' + params.icon + '">';
		} else if (params.spinner) {
			overlayDOM.appendChild(params.spinner.el);
		}
		if (doesTransitions) {
			overlayDOM.addEventListener("webkitAnimationEnd", handleAnim, false);
			overlayDOM.addEventListener("msAnimationEnd", handleAnim, false);
			overlayDOM.addEventListener("oAnimationEnd", handleAnim, false);
			overlayDOM.addEventListener("animationend", handleAnim, false);
		}
		if (params.parentEl) {
			document.getElementById(params.parentEl).appendChild(overlayDOM);
		} else {
			document.body.appendChild(overlayDOM);
		}

		settings.onbeforeshow();
		// begin fade in
		if (doesTransitions) {
			overlayDOM.className += " ios-overlay-show";
		} else if (typeof $ === "function") {
			$(overlayDOM).fadeIn({
				duration: 200
			}, function() {
				settings.onshow();
			});
		}

		if (settings.duration) {
			window.setTimeout(function() {
				hide();
			}, settings.duration);
		}

	}());

	var hide = function() {
		// pre-callback
		settings.onbeforehide();
		// fade out
		if (doesTransitions) {
			// CSS animation bound to classes
			overlayDOM.className = overlayDOM.className.replace("show", "hide");
		} else if (typeof $ === "function") {
			// polyfill requires jQuery
			$(overlayDOM).fadeOut({
				duration: 200
			}, function() {
				destroy();
				settings.onhide();
			});
		}
	};

	var destroy = function() {
		if (params.parentEl) {
			document.getElementById(params.parentEl).removeChild(overlayDOM);
		} else {
			document.body.removeChild(overlayDOM);
		}
	};

	var update = function(params) {
		if (params.text) {
			overlayDOM.getElementsByTagName("span")[0].innerHTML = params.text;
		}
		if (params.icon) {
			if (settings.spinner) {
				// Unless we set spinner to null, this will throw on the second update
				settings.spinner.el.parentNode.removeChild(settings.spinner.el);
				settings.spinner = null;
			}
			overlayDOM.innerHTML += '<img src="' + params.icon + '">';
		}
	};

	return {
		hide: hide,
		destroy: destroy,
		update: update
	};

};

//Added support for requirejs
if (typeof define === 'function' && define.amd) {
	define([], function() {
		return iosOverlay;
	});
}
