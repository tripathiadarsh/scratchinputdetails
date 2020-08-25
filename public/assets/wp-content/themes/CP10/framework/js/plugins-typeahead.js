jQuery(document).ready(function(){ 
	
if(jQuery(".typeahead").length > 0 && typeof ajax_site_url != 'undefined' ){
	
 							
jQuery("input.typeahead").typeahead({	
									
		onSelect: function(item) { 
		  window.location = item.extra;
		},
		ajax: {
			
			url: ajax_site_url,
			timeout: 500,
			triggerLength: 1,
			dataType: 'json',			
			method: "POST",	
			
			data: {
            	search_action: "search_live",
				search_data: jQuery(".typeahead").val(), 
        	},
			preDispatch: function (query) { 
				return {
					search: query,
					search_action: "search_live",
				}
			},
			preProcess: function (data) {
			 
				if (data.success === false) {
					 
					return false;
				}
			 
				return data.mylist;
			}
		},	
	});

}

}); 

/* =============================================================================
  TYPEAHEAD
  ========================================================================== */	  
!function(e){"use strict";var t=function(t,i){e.fn.typeahead.defaults;i.scrollBar&&(i.items=100,i.menu='<ul class="typeahead dropdown-menu" style="max-height:220px;overflow:auto;"></ul>');var s=this;if(s.$element=e(t),s.options=e.extend({},e.fn.typeahead.defaults,i),s.$menu=e(s.options.menu).insertAfter(s.$element),s.eventSupported=s.options.eventSupported||s.eventSupported,s.grepper=s.options.grepper||s.grepper,s.highlighter=s.options.highlighter||s.highlighter,s.lookup=s.options.lookup||s.lookup,s.matcher=s.options.matcher||s.matcher,s.render=s.options.render||s.render,s.onSelect=s.options.onSelect||null,s.sorter=s.options.sorter||s.sorter,s.select=s.options.select||s.select,s.source=s.options.source||s.source,s.displayField=s.options.displayField||s.displayField,s.valueField=s.options.valueField||s.valueField,s.autoSelect=s.options.autoSelect||s.autoSelect,s.options.ajax){var a=s.options.ajax;"string"==typeof a?s.ajax=e.extend({},e.fn.typeahead.defaults.ajax,{url:a}):("string"==typeof a.displayField&&(s.displayField=s.options.displayField=a.displayField),"string"==typeof a.valueField&&(s.valueField=s.options.valueField=a.valueField),s.ajax=e.extend({},e.fn.typeahead.defaults.ajax,a)),s.ajax.url||(s.ajax=null),s.query=""}else s.source=s.options.source,s.ajax=null;s.shown=!1,s.listen()};t.prototype={constructor:t,eventSupported:function(e){var t=e in this.$element;return t||(this.$element.setAttribute(e,"return;"),t="function"==typeof this.$element[e]),t},select:function(){var e=this.$menu.find(".active");if(e.length){var t=e.attr("data-value"),i=e.attr("data-link"),s=this.$menu.find(".active a").text();this.$element.val(this.updater(s)).change(),this.options.onSelect&&this.options.onSelect({value:t,text:s,extra:i})}return this.hide()},updater:function(e){return e},show:function(){var t=e.extend({},this.$element.position(),{height:this.$element[0].offsetHeight});if(this.$menu.css({top:t.top+t.height,left:t.left}),this.options.alignWidth){var i=e(this.$element[0]).outerWidth();this.$menu.css({width:i})}return this.$menu.show(),this.shown=!0,this},hide:function(){return this.$menu.hide(),this.shown=!1,this},ajaxLookup:function(){var t=e.trim(this.$element.val());if(t===this.query)return this;if(this.query=t,this.ajax.timerId&&(clearTimeout(this.ajax.timerId),this.ajax.timerId=null),!t||t.length<this.ajax.triggerLength)return this.ajax.xhr&&(this.ajax.xhr.abort(),this.ajax.xhr=null,this.ajaxToggleLoadClass(!1)),this.shown?this.hide():this;return this.ajax.timerId=setTimeout(e.proxy(function(){this.ajaxToggleLoadClass(!0),this.ajax.xhr&&this.ajax.xhr.abort();var i=this.ajax.preDispatch?this.ajax.preDispatch(t):{query:t};this.ajax.xhr=e.ajax({url:this.ajax.url,data:i,success:e.proxy(this.ajaxSource,this),type:this.ajax.method||"get",dataType:"json",headers:this.ajax.headers||{}}),this.ajax.timerId=null},this),this.ajax.timeout),this},ajaxSource:function(e){this.ajaxToggleLoadClass(!1);var t,i=this;if(i.ajax.xhr)return i.ajax.preProcess&&(e=i.ajax.preProcess(e)),i.ajax.data=e,(t=i.grepper(i.ajax.data)||[]).length?(i.ajax.xhr=null,i.render(t.slice(0,i.options.items)).show()):i.shown?i.hide():i},ajaxToggleLoadClass:function(e){this.ajax.loadingClass&&this.$element.toggleClass(this.ajax.loadingClass,e)},lookup:function(e){var t,i=this;if(!i.ajax)return i.query=i.$element.val(),i.query&&(t=i.grepper(i.source))?(0==t.length&&(t[0]={id:-21,name:"Result not Found"}),i.render(t.slice(0,i.options.items)).show()):i.shown?i.hide():i;i.ajaxer()},matcher:function(e){return e; return~e.toLowerCase().indexOf(this.query.toLowerCase())},sorter:function(e){if(this.options.ajax)return e;for(var t,i=[],s=[],a=[];t=e.shift();)t.toLowerCase().indexOf(this.query.toLowerCase())?~t.indexOf(this.query)?s.push(t):a.push(t):i.push(t);return i.concat(s,a)},highlighter:function(e){var t=this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&");return e.replace(new RegExp("("+t+")","ig"),function(e,t){return"<strong>"+t+"</strong>"})},render:function(t){var i,s=this,a="string"==typeof s.options.displayField;return t=e(t).map(function(t,o){return"object"==typeof o?(i=a?o[s.options.displayField]:s.options.displayField(o),(t=e(s.options.item).attr("data-value",o[s.options.valueField]).attr("data-link",o.link))[0].innerHTML='<div data-link="'+o.link+'" style="cursor:pointer;"><img src="'+o.img+'" style="width:40px; height:40px; border:1px solid #ddd; padding:1px;" class="float-left mr-3"><div class="tname"><span>'+o.name+'</span><span class="ttext d-none d-lg-block"> '+o.text+" </span></div> </div>"):i=o,t.find("a").html(s.highlighter(i)),t[0]}),s.autoSelect&&t.first().addClass("active"),this.$menu.html(t),this},grepper:function(t){var i,s,a=this,o="string"==typeof a.options.displayField;if(!(o&&t&&t.length))return null;if(t[0].hasOwnProperty(a.options.displayField))i=e.grep(t,function(e){return s=o?e[a.options.displayField]:a.options.displayField(e),a.matcher(s)});else{if("string"!=typeof t[0])return null;i=e.grep(t,function(e){return a.matcher(e)})}return this.sorter(i)},next:function(t){var i=this.$menu.find(".active").removeClass("active").next();if(i.length||(i=e(this.$menu.find("li")[0])),this.options.scrollBar){var s=this.$menu.children("li").index(i);s%8==0&&this.$menu.scrollTop(26*s)}i.addClass("active")},prev:function(e){var t=this.$menu.find(".active").removeClass("active").prev();if(t.length||(t=this.$menu.find("li").last()),this.options.scrollBar){var i=this.$menu.children("li"),s=i.length-1,a=i.index(t);(s-a)%8==0&&this.$menu.scrollTop(26*(a-7))}t.addClass("active")},listen:function(){this.$element.on("focus",e.proxy(this.focus,this)).on("blur",e.proxy(this.blur,this)).on("keypress",e.proxy(this.keypress,this)).on("keyup",e.proxy(this.keyup,this)),this.eventSupported("keydown")&&this.$element.on("keydown",e.proxy(this.keydown,this)),this.$menu.on("click",e.proxy(this.click,this)).on("mouseenter","li",e.proxy(this.mouseenter,this)).on("mouseleave","li",e.proxy(this.mouseleave,this))},move:function(e){if(this.shown){switch(e.keyCode){case 9:case 13:case 27:e.preventDefault();break;case 38:e.preventDefault(),this.prev();break;case 40:e.preventDefault(),this.next()}e.stopPropagation()}},keydown:function(t){this.suppressKeyPressRepeat=~e.inArray(t.keyCode,[40,38,9,13,27]),this.move(t)},keypress:function(e){this.suppressKeyPressRepeat||this.move(e)},keyup:function(e){switch(e.keyCode){case 40:case 38:case 16:case 17:case 18:break;case 9:case 13:if(!this.shown)return;this.select();break;case 27:if(!this.shown)return;this.hide();break;default:this.ajax?this.ajaxLookup():this.lookup()}e.stopPropagation(),e.preventDefault()},focus:function(e){this.focused=!0},blur:function(e){this.focused=!1,!this.mousedover&&this.shown&&this.hide()},click:function(e){e.stopPropagation(),e.preventDefault(),this.select(),this.$element.focus()},mouseenter:function(t){this.mousedover=!0,this.$menu.find(".active").removeClass("active"),e(t.currentTarget).addClass("active")},mouseleave:function(e){this.mousedover=!1,!this.focused&&this.shown&&this.hide()},destroy:function(){this.$element.off("focus",e.proxy(this.focus,this)).off("blur",e.proxy(this.blur,this)).off("keypress",e.proxy(this.keypress,this)).off("keyup",e.proxy(this.keyup,this)),this.eventSupported("keydown")&&this.$element.off("keydown",e.proxy(this.keydown,this)),this.$menu.off("click",e.proxy(this.click,this)).off("mouseenter","li",e.proxy(this.mouseenter,this)).off("mouseleave","li",e.proxy(this.mouseleave,this)),this.$element.removeData("typeahead")}},e.fn.typeahead=function(i){return this.each(function(){var s=e(this),a=s.data("typeahead"),o="object"==typeof i&&i;a||s.data("typeahead",a=new t(this,o)),"string"==typeof i&&a[i]()})},e.fn.typeahead.defaults={source:[],items:10,scrollBar:!1,alignWidth:!0,menu:'<ul class="typeahead dropdown-menu"></ul>',item:"<li></li>",valueField:"id",displayField:"name",autoSelect:!0,onSelect:function(){},ajax:{url:null,timeout:300,method:"get",triggerLength:1,loadingClass:null,preDispatch:null,preProcess:null}},e.fn.typeahead.Constructor=t,e(function(){e("body").on("focus.typeahead.data-api",'[data-provide="typeahead"]',function(t){var i=e(this);i.data("typeahead")||(t.preventDefault(),i.typeahead(i.data()))})})}(window.jQuery);