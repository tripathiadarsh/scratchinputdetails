 
/* =============================================================================
TAXONOMY LISTINGS
  ========================================================================== */	 

function ChangeSearchValues(e, t, a, o, n, r, i) {	
	
	  jQuery.ajax({
        type: "GET",  
		url: ajax_site_url,	
        data: {
			core_aj: 1,
            action: "ChangeSearchValues",
			val: t,
            key: a,
			cl: o,
			pr: n,
			add: r,
        },
        success: function(r) { 
		
		jQuery('#'+i).html(r);
		jQuery('#'+i).prop('disabled', false);
		
        },
        error: function(e) {
             
        }
    });	
 
} 

 
/* =============================================================================
UPLOAD FORMS
  ========================================================================== */	 

(function (factory) {
    if (typeof define === "function" && define.amd) {
        // Register as an anonymous AMD module:
        define(["jquery"], factory);
    } else {
        // Browser globals:
        factory(jQuery);
    }
}(function( $, undefined ) {

var uuid = 0,
	slice = Array.prototype.slice,
	_cleanData = $.cleanData;
$.cleanData = function( elems ) {
	for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
		try {
			$( elem ).triggerHandler( "remove" );
		// http://bugs.jquery.com/ticket/8235
		} catch( e ) {}
	}
	_cleanData( elems );
};

$.widget = function( name, base, prototype ) {
	var fullName, existingConstructor, constructor, basePrototype,
		namespace = name.split( "." )[ 0 ];

	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};
	// extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,
		// copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),
		// track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	});

	basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( $.isFunction( value ) ) {
			prototype[ prop ] = (function() {
				var _super = function() {
						return base.prototype[ prop ].apply( this, arguments );
					},
					_superApply = function( args ) {
						return base.prototype[ prop ].apply( this, args );
					};
				return function() {
					var __super = this._super,
						__superApply = this._superApply,
						returnValue;

					this._super = _super;
					this._superApply = _superApply;

					returnValue = value.apply( this, arguments );

					this._super = __super;
					this._superApply = __superApply;

					return returnValue;
				};
			})();
		}
	});
	constructor.prototype = $.widget.extend( basePrototype, {
		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: basePrototype.widgetEventPrefix || name
	}, prototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		// TODO remove widgetBaseClass, see #8155
		widgetBaseClass: fullName,
		widgetFullName: fullName
	});

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
		});
		// remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );
};

$.widget.extend = function( target ) {
	var input = slice.call( arguments, 1 ),
		inputIndex = 0,
		inputLength = input.length,
		key,
		value;
	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :
						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );
				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = slice.call( arguments, 1 ),
			returnValue = this;

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
			$.widget.extend.apply( null, [ options ].concat(args) ) :
			options;

		if ( isMethodCall ) {
			this.each(function() {
				var methodValue,
					instance = $.data( this, fullName );
				if ( !instance ) {
					return $.error( "cannot call methods on " + name + " prior to initialization; " +
						"attempted to call method '" + options + "'" );
				}
				if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
					return $.error( "no such method '" + options + "' for " + name + " widget instance" );
				}
				methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue && methodValue.jquery ?
						returnValue.pushStack( methodValue.get() ) :
						methodValue;
					return false;
				}
			});
		} else {
			this.each(function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} )._init();
				} else {
					new object( options, this );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",
	options: {
		disabled: false,

		// callbacks
		create: null
	},
	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = uuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;
		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();

		if ( element !== this ) {
			// 1.9 BC for #7810
			// TODO remove dual storage
			$.data( element, this.widgetName, this );
			$.data( element, this.widgetFullName, this );
			this._on( this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			});
			this.document = $( element.style ?
				// element within the document
				element.ownerDocument :
				// element is window or document
				element.document || element );
			this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
		}

		this._create();
		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},
	_getCreateOptions: $.noop,
	_getCreateEventData: $.noop,
	_create: $.noop,
	_init: $.noop,

	destroy: function() {
		this._destroy();
		// we can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.unbind( this.eventNamespace )
			// 1.9 BC for #7810
			// TODO remove dual storage
			.removeData( this.widgetName )
			.removeData( this.widgetFullName )
			// support: jquery <1.6.3
			// http://bugs.jquery.com/ticket/9413
			.removeData( $.camelCase( this.widgetFullName ) );
		this.widget()
			.unbind( this.eventNamespace )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetFullName + "-disabled " +
				"ui-state-disabled" );

		// clean up events and states
		this.bindings.unbind( this.eventNamespace );
		this.hoverable.removeClass( "ui-state-hover" );
		this.focusable.removeClass( "ui-state-focus" );
	},
	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key,
			parts,
			curOption,
			i;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {
			// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( value === undefined ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( value === undefined ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				.toggleClass( this.widgetFullName + "-disabled ui-state-disabled", !!value )
				.attr( "aria-disabled", value );
			this.hoverable.removeClass( "ui-state-hover" );
			this.focusable.removeClass( "ui-state-focus" );
		}

		return this;
	},

	enable: function() {
		return this._setOption( "disabled", false );
	},
	disable: function() {
		return this._setOption( "disabled", true );
	},

	_on: function( element, handlers ) {
		var delegateElement,
			instance = this;
		// no element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			// accept selectors, DOM elements
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {
				// allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( instance.options.disabled === true ||
						$( this ).hasClass( "ui-state-disabled" ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^(\w+)\s*(.*)$/ ),
				eventName = match[1] + instance.eventNamespace,
				selector = match[2];
			if ( selector ) {
				delegateElement.delegate( selector, eventName, handlerProxy );
			} else {
				element.bind( eventName, handlerProxy );
			}
		});
	},

	_off: function( element, eventName ) {
		eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) + this.eventNamespace;
		element.unbind( eventName ).undelegate( eventName );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-hover" );
			},
			mouseleave: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-hover" );
			}
		});
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-focus" );
			}
		});
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}
		var hasOptions,
			effectName = !options ?
				method :
				options === true || typeof options === "number" ?
					defaultEffect :
					options.effect || defaultEffect;
		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}
		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;
		if ( options.delay ) {
			element.delay( options.delay );
		}
		if ( hasOptions && $.effects && ( $.effects.effect[ effectName ] || $.uiBackCompat !== false && $.effects[ effectName ] ) ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue(function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			});
		}
	};
});

// DEPRECATED
if ( $.uiBackCompat !== false ) {
	$.Widget.prototype._getCreateOptions = function() {
		return $.metadata && $.metadata.get( this.element[0] )[ this.widgetName ];
	};
}

}));


(function(a){"use strict";var b=function(a,c){var d=/[^\w\-\.:]/.test(a)?new Function(b.arg+",tmpl","var _e=tmpl.encode"+b.helper+",_s='"+a.replace(b.regexp,b.func)+"';return _s;"):b.cache[a]=b.cache[a]||b(b.load(a));return c?d(c,b):function(a){return d(a,b)}};b.cache={},b.load=function(a){
																																																																								
								 																																																															return document.getElementById(a).innerHTML},b.regexp=/([\s'\\])(?![^%]*%\})|(?:\{%(=|#)([\s\S]+?)%\})|(\{%)|(%\})/g,b.func=function(a,b,c,d,e,f){if(b)return{"\n":"\\n","\r":"\\r","\t":"\\t"," ":" "}[a]||"\\"+a;if(c)return c==="="?"'+_e("+d+")+'":"'+("+d+"||'')+'";if(e)return"';";if(f)return"_s+='"},b.encReg=/[<>&"'\x00]/g,b.encMap={"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&#39;"},b.encode=function(a){return String(a||"").replace(b.encReg,function(a){return b.encMap[a]||""})},b.arg="o",b.helper=",print=function(s,e){_s+=e&&(s||'')||_e(s);},include=function(s,d){_s+=tmpl(s,d);}",typeof define=="function"&&define.amd?define(function(){return b}):a.tmpl=b})(this);

(function(a){"use strict";var b=function(a,c,d){var e=document.createElement("img"),f,g;return e.onerror=c,e.onload=function(){g&&(!d||!d.noRevoke)&&b.revokeObjectURL(g),c(b.scale(e,d))},window.Blob&&a instanceof Blob||window.File&&a instanceof File?(f=g=b.createObjectURL(a),e._type=a.type):f=a,f?(e.src=f,e):b.readFile(a,function(a){var b=a.target;b&&b.result?e.src=b.result:c(a)})},c=window.createObjectURL&&window||window.URL&&URL.revokeObjectURL&&URL||window.webkitURL&&webkitURL;b.detectSubsampling=function(a){var b=a.width,c=a.height,d,e;return b*c>1048576?(d=document.createElement("canvas"),d.width=d.height=1,e=d.getContext("2d"),e.drawImage(a,-b+1,0),e.getImageData(0,0,1,1).data[3]===0):!1},b.detectVerticalSquash=function(a,b){var c=document.createElement("canvas"),d=c.getContext("2d"),e,f,g,h,i;c.width=1,c.height=b,d.drawImage(a,0,0),e=d.getImageData(0,0,1,b).data,f=0,g=b,h=b;while(h>f)i=e[(h-1)*4+3],i===0?g=h:f=h,h=g+f>>1;return h/b},b.renderImageToCanvas=function(a,c,d,e){var f=a.width,g=a.height,h=c.getContext("2d"),i,j=1024,k=document.createElement("canvas"),l,m,n,o,p;h.save(),b.detectSubsampling(a)&&(f/=2,g/=2),i=b.detectVerticalSquash(a,g),k.width=k.height=j,l=k.getContext("2d"),m=0;while(m<g){n=m+j>g?g-m:j,o=0;while(o<f)p=o+j>f?f-o:j,l.clearRect(0,0,j,j),l.drawImage(a,-o,-m),h.drawImage(k,0,0,p,n,Math.floor(o*d/f),Math.floor(m*e/g/i),Math.ceil(p*d/f),Math.ceil(n*e/g/i)),o+=j;m+=j}h.restore(),k=l=null},b.scale=function(a,c){c=c||{};var d=document.createElement("canvas"),e=a.width,f=a.height,g=Math.max((c.minWidth||e)/e,(c.minHeight||f)/f);return g>1&&(e=parseInt(e*g,10),f=parseInt(f*g,10)),g=Math.min((c.maxWidth||e)/e,(c.maxHeight||f)/f),g<1&&(e=parseInt(e*g,10),f=parseInt(f*g,10)),a.getContext||c.canvas&&d.getContext?(d.width=e,d.height=f,a._type==="image/jpeg"?b.renderImageToCanvas(a,d,e,f):d.getContext("2d").drawImage(a,0,0,e,f),d):(a.width=e,a.height=f,a)},b.createObjectURL=function(a){return c?c.createObjectURL(a):!1},b.revokeObjectURL=function(a){return c?c.revokeObjectURL(a):!1},b.readFile=function(a,b){if(window.FileReader&&FileReader.prototype.readAsDataURL){var c=new FileReader;return c.onload=c.onerror=b,c.readAsDataURL(a),c}return!1},typeof define=="function"&&define.amd?define(function(){return b}):a.loadImage=b})(this);

(function(a){"use strict";var b=a.HTMLCanvasElement&&a.HTMLCanvasElement.prototype,c=a.Blob&&function(){try{return Boolean(new Blob)}catch(a){return!1}}(),d=c&&a.Uint8Array&&function(){try{return(new Blob([new Uint8Array(100)])).size===100}catch(a){return!1}}(),e=a.BlobBuilder||a.WebKitBlobBuilder||a.MozBlobBuilder||a.MSBlobBuilder,f=(c||e)&&a.atob&&a.ArrayBuffer&&a.Uint8Array&&function(a){var b,f,g,h,i,j;a.split(",")[0].indexOf("base64")>=0?b=atob(a.split(",")[1]):b=decodeURIComponent(a.split(",")[1]),f=new ArrayBuffer(b.length),g=new Uint8Array(f);for(h=0;h<b.length;h+=1)g[h]=b.charCodeAt(h);return i=a.split(",")[0].split(":")[1].split(";")[0],c?new Blob([d?g:f],{type:i}):(j=new e,j.append(f),j.getBlob(i))};a.HTMLCanvasElement&&!b.toBlob&&(b.mozGetAsFile?b.toBlob=function(a,c,d){d&&b.toDataURL&&f?a(f(this.toDataURL(c,d))):a(this.mozGetAsFile("blob",c))}:b.toDataURL&&f&&(b.toBlob=function(a,b,c){a(f(this.toDataURL(b,c)))})),typeof define=="function"&&define.amd?define(function(){return f}):a.dataURLtoBlob=f})(this);

!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):a(window.jQuery)}(function(a){"use strict";var b=0;a.ajaxTransport("iframe",function(c){if(c.async&&("POST"===c.type||"GET"===c.type)){var d,e;return{send:function(f,g){d=a('<form style="display:none;"></form>'),d.attr("accept-charset",c.formAcceptCharset),e=a('<iframe src="javascript:false;" name="iframe-transport-'+(b+=1)+'"></iframe>').bind("load",function(){var b,f=a.isArray(c.paramName)?c.paramName:[c.paramName];e.unbind("load").bind("load",function(){var b;try{if(b=e.contents(),!b.length||!b[0].firstChild)throw new Error}catch(a){b=void 0}g(200,"success",{iframe:b}),a('<iframe src="javascript:false;"></iframe>').appendTo(d),d.remove()}),d.prop("target",e.prop("name")).prop("action",c.url).prop("method",c.type),c.formData&&a.each(c.formData,function(b,c){a('<input type="hidden"/>').prop("name",c.name).val(c.value).appendTo(d)}),c.fileInput&&c.fileInput.length&&"POST"===c.type&&(b=c.fileInput.clone(),c.fileInput.after(function(a){return b[a]}),c.paramName&&c.fileInput.each(function(b){a(this).prop("name",f[b]||c.paramName)}),d.append(c.fileInput).prop("enctype","multipart/form-data").prop("encoding","multipart/form-data")),d.submit(),b&&b.length&&c.fileInput.each(function(c,d){var e=a(b[c]);a(d).prop("name",e.prop("name")),e.replaceWith(d)})}),d.append(e).appendTo(document.body)},abort:function(){e&&e.unbind("load").prop("src","javascript".concat(":false;")),d&&d.remove()}}}}),a.ajaxSetup({converters:{"iframe text":function(b){return a(b[0].body).text()},"iframe json":function(b){return a.parseJSON(a(b[0].body).text())},"iframe html":function(b){return a(b[0].body).html()},"iframe script":function(b){return a.globalEval(a(b[0].body).text())}}})});

!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery","jquery.ui.widget"],a):a(window.jQuery)}(function(a){"use strict";a.support.xhrFileUpload=!(!window.XMLHttpRequestUpload||!window.FileReader),a.support.xhrFormDataFileUpload=!!window.FormData,a.widget("blueimp.fileupload",{options:{dropZone:a(document),pasteZone:a(document),fileInput:void 0,replaceFileInput:!0,paramName:void 0,singleFileUploads:!0,limitMultiFileUploads:void 0,sequentialUploads:!1,limitConcurrentUploads:void 0,forceIframeTransport:!1,redirect:void 0,redirectParamName:void 0,postMessage:void 0,multipart:!0,maxChunkSize:void 0,uploadedBytes:void 0,recalculateProgress:!0,progressInterval:100,bitrateInterval:500,formData:function(a){return a.serializeArray()},add:function(a,b){b.submit()},processData:!1,contentType:!1,cache:!1},_refreshOptionsList:["fileInput","dropZone","pasteZone","multipart","forceIframeTransport"],_BitrateTimer:function(){this.timestamp=+new Date,this.loaded=0,this.bitrate=0,this.getBitrate=function(a,b,c){var d=a-this.timestamp;return(!this.bitrate||!c||d>c)&&(this.bitrate=(b-this.loaded)*(1e3/d)*8,this.loaded=b,this.timestamp=a),this.bitrate}},_isXHRUpload:function(b){return!b.forceIframeTransport&&(!b.multipart&&a.support.xhrFileUpload||a.support.xhrFormDataFileUpload)},_getFormData:function(b){var c;return"function"==typeof b.formData?b.formData(b.form):a.isArray(b.formData)?b.formData:b.formData?(c=[],a.each(b.formData,function(a,b){c.push({name:a,value:b})}),c):[]},_getTotal:function(b){var c=0;return a.each(b,function(a,b){c+=b.size||1}),c},_onProgress:function(a,b){if(a.lengthComputable){var d,e,c=+new Date;if(b._time&&b.progressInterval&&c-b._time<b.progressInterval&&a.loaded!==a.total)return;b._time=c,d=b.total||this._getTotal(b.files),e=parseInt(a.loaded/a.total*(b.chunkSize||d),10)+(b.uploadedBytes||0),this._loaded+=e-(b.loaded||b.uploadedBytes||0),b.lengthComputable=!0,b.loaded=e,b.total=d,b.bitrate=b._bitrateTimer.getBitrate(c,e,b.bitrateInterval),this._trigger("progress",a,b),this._trigger("progressall",a,{lengthComputable:!0,loaded:this._loaded,total:this._total,bitrate:this._bitrateTimer.getBitrate(c,this._loaded,b.bitrateInterval)})}},_initProgressListener:function(b){var c=this,d=b.xhr?b.xhr():a.ajaxSettings.xhr();d.upload&&(a(d.upload).bind("progress",function(a){var d=a.originalEvent;a.lengthComputable=d.lengthComputable,a.loaded=d.loaded,a.total=d.total,c._onProgress(a,b)}),b.xhr=function(){return d})},_initXHRData:function(b){var c,d=b.files[0],e=b.multipart||!a.support.xhrFileUpload,f=b.paramName[0];b.headers=b.headers||{},b.contentRange&&(b.headers["Content-Range"]=b.contentRange),e?a.support.xhrFormDataFileUpload&&(b.postMessage?(c=this._getFormData(b),b.blob?c.push({name:f,value:b.blob}):a.each(b.files,function(a,d){c.push({name:b.paramName[a]||f,value:d})})):(b.formData instanceof FormData?c=b.formData:(c=new FormData,a.each(this._getFormData(b),function(a,b){c.append(b.name,b.value)})),b.blob?(b.headers["Content-Disposition"]='attachment; filename="'+encodeURI(d.name)+'"',c.append(f,b.blob,d.name)):a.each(b.files,function(a,d){(window.Blob&&d instanceof Blob||window.File&&d instanceof File)&&c.append(b.paramName[a]||f,d,d.name)})),b.data=c):(b.headers["Content-Disposition"]='attachment; filename="'+encodeURI(d.name)+'"',b.contentType=d.type,b.data=b.blob||d),b.blob=null},_initIframeSettings:function(b){b.dataType="iframe "+(b.dataType||""),b.formData=this._getFormData(b),b.redirect&&a("<a></a>").prop("href",b.url).prop("host")!==location.host&&b.formData.push({name:b.redirectParamName||"redirect",value:b.redirect})},_initDataSettings:function(a){this._isXHRUpload(a)?(this._chunkedUpload(a,!0)||(a.data||this._initXHRData(a),this._initProgressListener(a)),a.postMessage&&(a.dataType="postmessage "+(a.dataType||""))):this._initIframeSettings(a,"iframe")},_getParamName:function(b){var c=a(b.fileInput),d=b.paramName;return d?a.isArray(d)||(d=[d]):(d=[],c.each(function(){for(var b=a(this),c=b.prop("name")||"files[]",e=(b.prop("files")||[1]).length;e;)d.push(c),e-=1}),d.length||(d=[c.prop("name")||"files[]"])),d},_initFormSettings:function(b){b.form&&b.form.length||(b.form=a(b.fileInput.prop("form")),b.form.length||(b.form=a(this.options.fileInput.prop("form")))),b.paramName=this._getParamName(b),b.url||(b.url=b.form.prop("action")||location.href),b.type=(b.type||b.form.prop("method")||"").toUpperCase(),"POST"!==b.type&&"PUT"!==b.type&&(b.type="POST"),b.formAcceptCharset||(b.formAcceptCharset=b.form.attr("accept-charset"))},_getAJAXSettings:function(b){var c=a.extend({},this.options,b);return this._initFormSettings(c),this._initDataSettings(c),c},_enhancePromise:function(a){return a.success=a.done,a.error=a.fail,a.complete=a.always,a},_getXHRPromise:function(b,c,d){var e=a.Deferred(),f=e.promise();return c=c||this.options.context||f,b===!0?e.resolveWith(c,d):b===!1&&e.rejectWith(c,d),f.abort=e.promise,this._enhancePromise(f)},_getUploadedBytes:function(a){var b=a.getResponseHeader("Range"),c=b&&b.split("-"),d=c&&c.length>1&&parseInt(c[1],10);return d&&d+1},_chunkedUpload:function(b,c){var l,m,d=this,e=b.files[0],f=e.size,g=b.uploadedBytes=b.uploadedBytes||0,h=b.maxChunkSize||f,i=e.slice||e.webkitSlice||e.mozSlice,j=a.Deferred(),k=j.promise();return!(!(this._isXHRUpload(b)&&i&&(g||h<f))||b.data)&&(!!c||(g>=f?(e.error="Uploaded bytes exceed file size",this._getXHRPromise(!1,b.context,[null,"error",e.error])):(m=function(c){var k=a.extend({},b);k.blob=i.call(e,g,g+h,e.type),k.chunkSize=k.blob.size,k.contentRange="bytes "+g+"-"+(g+k.chunkSize-1)+"/"+f,d._initXHRData(k),d._initProgressListener(k),l=(a.ajax(k)||d._getXHRPromise(!1,k.context)).done(function(c,e,h){g=d._getUploadedBytes(h)||g+k.chunkSize,k.loaded||d._onProgress(a.Event("progress",{lengthComputable:!0,loaded:g-k.uploadedBytes,total:g-k.uploadedBytes}),k),b.uploadedBytes=k.uploadedBytes=g,g<f?m():j.resolveWith(k.context,[c,e,h])}).fail(function(a,b,c){j.rejectWith(k.context,[a,b,c])})},this._enhancePromise(k),k.abort=function(){return l.abort()},m(),k)))},_beforeSend:function(a,b){0===this._active&&(this._trigger("start"),this._bitrateTimer=new this._BitrateTimer),this._active+=1,this._loaded+=b.uploadedBytes||0,this._total+=this._getTotal(b.files)},_onDone:function(b,c,d,e){this._isXHRUpload(e)||this._onProgress(a.Event("progress",{lengthComputable:!0,loaded:1,total:1}),e),e.result=b,e.textStatus=c,e.jqXHR=d,this._trigger("done",null,e)},_onFail:function(a,b,c,d){d.jqXHR=a,d.textStatus=b,d.errorThrown=c,this._trigger("fail",null,d),d.recalculateProgress&&(this._loaded-=d.loaded||d.uploadedBytes||0,this._total-=d.total||this._getTotal(d.files))},_onAlways:function(a,b,c,d){this._active-=1,d.textStatus=b,c&&c.always?(d.jqXHR=c,d.result=a):(d.jqXHR=a,d.errorThrown=c),this._trigger("always",null,d),0===this._active&&(this._trigger("stop"),this._loaded=this._total=0,this._bitrateTimer=null)},_onSend:function(b,c){var e,f,g,h,d=this,i=d._getAJAXSettings(c),j=function(){return d._sending+=1,i._bitrateTimer=new d._BitrateTimer,e=e||((f||d._trigger("send",b,i)===!1)&&d._getXHRPromise(!1,i.context,f)||d._chunkedUpload(i)||a.ajax(i)).done(function(a,b,c){d._onDone(a,b,c,i)}).fail(function(a,b,c){d._onFail(a,b,c,i)}).always(function(a,b,c){if(d._sending-=1,d._onAlways(a,b,c,i),i.limitConcurrentUploads&&i.limitConcurrentUploads>d._sending)for(var f,e=d._slots.shift();e;){if(f=e.state?"pending"===e.state():!e.isRejected()){e.resolve();break}e=d._slots.shift()}})};return this._beforeSend(b,i),this.options.sequentialUploads||this.options.limitConcurrentUploads&&this.options.limitConcurrentUploads<=this._sending?(this.options.limitConcurrentUploads>1?(g=a.Deferred(),this._slots.push(g),h=g.pipe(j)):h=this._sequence=this._sequence.pipe(j,j),h.abort=function(){return f=[void 0,"abort","abort"],e?e.abort():(g&&g.rejectWith(i.context,f),j())},this._enhancePromise(h)):j()},_onAdd:function(b,c){var i,j,k,l,d=this,e=!0,f=a.extend({},this.options,c),g=f.limitMultiFileUploads,h=this._getParamName(f);if((f.singleFileUploads||g)&&this._isXHRUpload(f))if(!f.singleFileUploads&&g)for(k=[],i=[],l=0;l<c.files.length;l+=g)k.push(c.files.slice(l,l+g)),j=h.slice(l,l+g),j.length||(j=h),i.push(j);else i=h;else k=[c.files],i=[h];return c.originalFiles=c.files,a.each(k||c.files,function(f,g){var h=a.extend({},c);return h.files=k?g:[g],h.paramName=i[f],h.submit=function(){return h.jqXHR=this.jqXHR=d._trigger("submit",b,this)!==!1&&d._onSend(b,this),this.jqXHR},e=d._trigger("add",b,h)}),e},_replaceFileInput:function(b){var c=b.clone(!0);a("<form></form>").append(c)[0].reset(),b.after(c).detach(),a.cleanData(b.unbind("remove")),this.options.fileInput=this.options.fileInput.map(function(a,d){return d===b[0]?c[0]:d}),b[0]===this.element[0]&&(this.element=c)},_handleFileTreeEntry:function(b,c){var g,d=this,e=a.Deferred(),f=function(a){a&&!a.entry&&(a.entry=b),e.resolve([a])};return c=c||"",b.isFile?b._file?(b._file.relativePath=c,e.resolve(b._file)):b.file(function(a){a.relativePath=c,e.resolve(a)},f):b.isDirectory?(g=b.createReader(),g.readEntries(function(a){d._handleFileTreeEntries(a,c+b.name+"/").done(function(a){e.resolve(a)}).fail(f)},f)):e.resolve([]),e.promise()},_handleFileTreeEntries:function(b,c){var d=this;return a.when.apply(a,a.map(b,function(a){return d._handleFileTreeEntry(a,c)})).pipe(function(){return Array.prototype.concat.apply([],arguments)})},_getDroppedFiles:function(b){b=b||{};var c=b.items;return c&&c.length&&(c[0].webkitGetAsEntry||c[0].getAsEntry)?this._handleFileTreeEntries(a.map(c,function(a){var b;return a.webkitGetAsEntry?(b=a.webkitGetAsEntry(),b&&(b._file=a.getAsFile()),b):a.getAsEntry()})):a.Deferred().resolve(a.makeArray(b.files)).promise()},_getSingleFileInputFiles:function(b){b=a(b);var d,e,c=b.prop("webkitEntries")||b.prop("entries");if(c&&c.length)return this._handleFileTreeEntries(c);if(d=a.makeArray(b.prop("files")),d.length)void 0===d[0].name&&d[0].fileName&&a.each(d,function(a,b){b.name=b.fileName,b.size=b.fileSize});else{if(e=b.prop("value"),!e)return a.Deferred().resolve([]).promise();d=[{name:e.replace(/^.*\\/,"")}]}return a.Deferred().resolve(d).promise()},_getFileInputFiles:function(b){return b instanceof a&&1!==b.length?a.when.apply(a,a.map(b,this._getSingleFileInputFiles)).pipe(function(){return Array.prototype.concat.apply([],arguments)}):this._getSingleFileInputFiles(b)},_onChange:function(b){var c=this,d={fileInput:a(b.target),form:a(b.target.form)};this._getFileInputFiles(d.fileInput).always(function(a){d.files=a,c.options.replaceFileInput&&c._replaceFileInput(d.fileInput),c._trigger("change",b,d)!==!1&&c._onAdd(b,d)})},_onPaste:function(b){var c=b.originalEvent.clipboardData,d=c&&c.items||[],e={files:[]};if(a.each(d,function(a,b){var c=b.getAsFile&&b.getAsFile();c&&e.files.push(c)}),this._trigger("paste",b,e)===!1||this._onAdd(b,e)===!1)return!1},_onDrop:function(a){var b=this,c=a.dataTransfer=a.originalEvent.dataTransfer,d={};c&&c.files&&c.files.length&&a.preventDefault(),this._getDroppedFiles(c).always(function(c){d.files=c,b._trigger("drop",a,d)!==!1&&b._onAdd(a,d)})},_onDragOver:function(b){var c=b.dataTransfer=b.originalEvent.dataTransfer;return this._trigger("dragover",b)!==!1&&void(c&&a.inArray("Files",c.types)!==-1&&(c.dropEffect="copy",b.preventDefault()))},_initEventHandlers:function(){this._isXHRUpload(this.options)&&(this._on(this.options.dropZone,{dragover:this._onDragOver,drop:this._onDrop}),this._on(this.options.pasteZone,{paste:this._onPaste})),this._on(this.options.fileInput,{change:this._onChange})},_destroyEventHandlers:function(){this._off(this.options.dropZone,"dragover drop"),this._off(this.options.pasteZone,"paste"),this._off(this.options.fileInput,"change")},_setOption:function(b,c){var d=a.inArray(b,this._refreshOptionsList)!==-1;d&&this._destroyEventHandlers(),this._super(b,c),d&&(this._initSpecialOptions(),this._initEventHandlers())},_initSpecialOptions:function(){var b=this.options;void 0===b.fileInput?b.fileInput=this.element.is('input[type="file"]')?this.element:this.element.find('input[type="file"]'):b.fileInput instanceof a||(b.fileInput=a(b.fileInput)),b.dropZone instanceof a||(b.dropZone=a(b.dropZone)),b.pasteZone instanceof a||(b.pasteZone=a(b.pasteZone))},_create:function(){var b=this.options;a.extend(b,a(this.element[0].cloneNode(!1)).data()),this._initSpecialOptions(),this._slots=[],this._sequence=this._getXHRPromise(!0),this._sending=this._active=this._loaded=this._total=0,this._initEventHandlers()},_destroy:function(){this._destroyEventHandlers()},add:function(b){var c=this;b&&!this.options.disabled&&(b.fileInput&&!b.files?this._getFileInputFiles(b.fileInput).always(function(a){b.files=a,c._onAdd(null,b)}):(b.files=a.makeArray(b.files),this._onAdd(null,b)))},send:function(b){if(b&&!this.options.disabled){if(b.fileInput&&!b.files){var f,g,c=this,d=a.Deferred(),e=d.promise();return e.abort=function(){return g=!0,f?f.abort():(d.reject(null,"abort","abort"),e)},this._getFileInputFiles(b.fileInput).always(function(a){g||(b.files=a,f=c._onSend(null,b).then(function(a,b,c){d.resolve(a,b,c)},function(a,b,c){d.reject(a,b,c)}))}),this._enhancePromise(e)}if(b.files=a.makeArray(b.files),b.files.length)return this._onSend(null,b)}return this._getXHRPromise(!1,b&&b.context)}})});

!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery","load-image","canvas-to-blob","./jquery.fileupload"],a):a(window.jQuery,window.loadImage)}(function(a,b){"use strict";a.widget("blueimp.fileupload",a.blueimp.fileupload,{options:{process:[],add:function(b,c){a(this).fileupload("process",c).done(function(){c.submit()})}},processActions:{load:function(c,d){var e=this,f=c.files[c.index],g=a.Deferred();return window.HTMLCanvasElement&&window.HTMLCanvasElement.prototype.toBlob&&("number"!==a.type(d.maxFileSize)||f.size<d.maxFileSize)&&(!d.fileTypes||d.fileTypes.test(f.type))?b(f,function(a){return a.src?(c.img=a,void g.resolveWith(e,[c])):g.rejectWith(e,[c])}):g.rejectWith(e,[c]),g.promise()},resize:function(c,d){var f,e=c.img;return d=a.extend({canvas:!0},d),e&&(f=b.scale(e,d),f.width===e.width&&f.height===e.height||(c.canvas=f)),c},save:function(b,c){if(!b.canvas)return b;var d=this,e=b.files[b.index],f=e.name,g=a.Deferred(),h=function(a){a.name||(e.type===a.type?a.name=e.name:e.name&&(a.name=e.name.replace(/\..+$/,"."+a.type.substr(6)))),b.files[b.index]=a,g.resolveWith(d,[b])};return b.canvas.mozGetAsFile?h(b.canvas.mozGetAsFile(/^image\/(jpeg|png)$/.test(e.type)&&f||(f&&f.replace(/\..+$/,"")||"blob")+".png",e.type)):b.canvas.toBlob(h,e.type),g.promise()}},_processFile:function(b,c,d){var e=this,f=a.Deferred().resolveWith(e,[{files:b,index:c}]),g=f.promise();return e._processing+=1,a.each(d.process,function(a,b){g=g.pipe(function(a){return e.processActions[b.action].call(this,a,b)})}),g.always(function(){e._processing-=1,0===e._processing&&e.element.removeClass("fileupload-processing")}),1===e._processing&&e.element.addClass("fileupload-processing"),g},process:function(b){var c=this,d=a.extend({},this.options,b);return d.process&&d.process.length&&this._isXHRUpload(d)&&a.each(b.files,function(e,f){c._processingQueue=c._processingQueue.pipe(function(){var f=a.Deferred();return c._processFile(b.files,e,d).always(function(){f.resolveWith(c)}),f.promise()})}),this._processingQueue},_create:function(){this._super(),this._processing=0,this._processingQueue=a.Deferred().resolveWith(this).promise()}})});

!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery","tmpl","load-image","./jquery.fileupload-fp"],a):a(window.jQuery,window.tmpl,window.loadImage)}(function(a,b,c){"use strict";a.widget("blueimp.fileupload",a.blueimp.fileupload,{options:{autoUpload:!1,maxNumberOfFiles:void 0,maxFileSize:void 0,minFileSize:void 0,acceptFileTypes:/.+$/i,previewSourceFileTypes:/^image\/(gif|jpeg|png)$/,previewSourceMaxFileSize:5e6,previewMaxWidth:150,previewMaxHeight:100,previewAsCanvas:!0,uploadTemplateId:"template-upload",downloadTemplateId:"template-download",filesContainer:void 0,prependFiles:!0,dataType:"json",add:function(b,c){var d=a(this).data("fileupload"),e=d.options,f=c.files;a(this).fileupload("process",c).done(function(){d._adjustMaxNumberOfFiles(-f.length),c.maxNumberOfFilesAdjusted=!0,c.files.valid=c.isValidated=d._validate(f),c.context=d._renderUpload(f).data("data",c),e.filesContainer[e.prependFiles?"prepend":"append"](c.context),d._renderPreviews(f,c.context),d._forceReflow(c.context),d._transition(c.context).done(function(){d._trigger("added",b,c)!==!1&&(e.autoUpload||c.autoUpload)&&c.autoUpload!==!1&&c.isValidated&&c.submit()})})},send:function(b,c){var d=a(this).data("fileupload");return!(!c.isValidated&&(c.maxNumberOfFilesAdjusted||(d._adjustMaxNumberOfFiles(-c.files.length),c.maxNumberOfFilesAdjusted=!0),!d._validate(c.files)))&&(c.context&&c.dataType&&"iframe"===c.dataType.substr(0,6)&&c.context.find(".progress").addClass(!a.support.transition&&"progress-animated").attr("aria-valuenow",100).find(".bar").css("width","100%"),d._trigger("sent",b,c))},done:function(b,c){var e,d=a(this).data("fileupload");c.context?c.context.each(function(f){var g=a.isArray(c.result)&&c.result[f]||{error:"File Not Accepted"};g.error&&d._adjustMaxNumberOfFiles(1),d._transition(a(this)).done(function(){var f=a(this);e=d._renderDownload([g]).replaceAll(f),d._forceReflow(e),d._transition(e).done(function(){c.context=a(this),d._trigger("completed",b,c)})})}):(a.isArray(c.result)&&(a.each(c.result,function(a,b){c.maxNumberOfFilesAdjusted&&b.error?d._adjustMaxNumberOfFiles(1):c.maxNumberOfFilesAdjusted||b.error||d._adjustMaxNumberOfFiles(-1)}),c.maxNumberOfFilesAdjusted=!0),e=d._renderDownload(c.result).appendTo(d.options.filesContainer),d._forceReflow(e),d._transition(e).done(function(){c.context=a(this),d._trigger("completed",b,c)}))},fail:function(b,c){var e,d=a(this).data("fileupload");c.maxNumberOfFilesAdjusted&&d._adjustMaxNumberOfFiles(c.files.length),c.context?c.context.each(function(f){if("abort"!==c.errorThrown){var g=c.files[f];g.error=g.error||c.errorThrown||!0,d._transition(a(this)).done(function(){var f=a(this);e=d._renderDownload([g]).replaceAll(f),d._forceReflow(e),d._transition(e).done(function(){c.context=a(this),d._trigger("failed",b,c)})})}else d._transition(a(this)).done(function(){a(this).remove(),d._trigger("failed",b,c)})}):"abort"!==c.errorThrown?(c.context=d._renderUpload(c.files).appendTo(d.options.filesContainer).data("data",c),d._forceReflow(c.context),d._transition(c.context).done(function(){c.context=a(this),d._trigger("failed",b,c)})):d._trigger("failed",b,c)},progress:function(a,b){if(b.context){var c=parseInt(b.loaded/b.total*100,10);b.context.find(".progress").attr("value",c).find(".bar").css("width",c+"%")}},progressall:function(b,c){var d=a(this),e=parseInt(c.loaded/c.total*100,10),f=d.find(".fileupload-progress"),g=f.find(".progress-extended");g.length&&g.html(d.data("fileupload")._renderExtendedProgress(c)),f.find(".progress").attr("value",e).find(".bar").css("width",e+"%")},start:function(b){var c=a(this).data("fileupload");c._transition(a(this).find(".fileupload-progress")).done(function(){c._trigger("started",b)})},stop:function(b){var c=a(this).data("fileupload");c._transition(a(this).find(".fileupload-progress")).done(function(){jQuery('#fileuploaddisplayall').hide(); a(this).find(".progress").attr("value","0").find(".bar").css("width","0%"),a(this).find(".progress-extended").html("&nbsp;"),c._trigger("stopped",b)})},destroy:function(b,c){var d=a(this).data("fileupload");c.url&&d._adjustMaxNumberOfFiles(1),d._transition(c.context).done(function(){a(this).remove(),d._trigger("destroyed",b,c)})}},_enableDragToDesktop:function(){var b=a(this),c=b.prop("href"),d=b.prop("download"),e="application/octet-stream";b.bind("dragstart",function(a){try{a.originalEvent.dataTransfer.setData("DownloadURL",[e,d,c].join(":"))}catch(a){}})},_adjustMaxNumberOfFiles:function(a){"number"==typeof this.options.maxNumberOfFiles&&(this.options.maxNumberOfFiles+=a,this.options.maxNumberOfFiles<1?this._disableFileInputButton():this._enableFileInputButton())},_formatFileSize:function(a){return"number"!=typeof a?"":a>=1e9?(a/1e9).toFixed(2)+" GB":a>=1e6?(a/1e6).toFixed(2)+" MB":(a/1e3).toFixed(2)+" KB"},_formatBitrate:function(a){return"number"!=typeof a?"":a>=1e9?(a/1e9).toFixed(2)+" Gbit/s":a>=1e6?(a/1e6).toFixed(2)+" Mbit/s":a>=1e3?(a/1e3).toFixed(2)+" kbit/s":a.toFixed(2)+" bit/s"},_formatTime:function(a){var b=new Date(1e3*a),c=parseInt(a/86400,10);return c=c?c+"d ":"",c+("0"+b.getUTCHours()).slice(-2)+":"+("0"+b.getUTCMinutes()).slice(-2)+":"+("0"+b.getUTCSeconds()).slice(-2)},_formatPercentage:function(a){return(100*a).toFixed(2)+" %"},_renderExtendedProgress:function(a){return this._formatBitrate(a.bitrate)+" | "+this._formatTime(8*(a.total-a.loaded)/a.bitrate)+" | "+this._formatPercentage(a.loaded/a.total)+" | "+this._formatFileSize(a.loaded)+" / "+this._formatFileSize(a.total)},_hasError:function(a){return a.error?a.error:this.options.maxNumberOfFiles<0?"Maximum number of files exceeded":this.options.acceptFileTypes.test(a.type)||this.options.acceptFileTypes.test(a.name)?this.options.maxFileSize&&a.size>this.options.maxFileSize?"File is too big":"number"==typeof a.size&&a.size<this.options.minFileSize?"File is too small":null:"Filetype not allowed"},_validate:function(b){var c=this,d=!!b.length;return a.each(b,function(a,b){b.error=c._hasError(b),b.error&&(d=!1)}),d},_renderTemplate:function(b,c){if(!b)return a();var d=b({files:c,formatFileSize:this._formatFileSize,options:this.options});return d instanceof a?d:a(this.options.templatesContainer).html(d).children()},_renderPreview:function(b,d){var e=this,f=this.options,g=a.Deferred();return(c&&c(b,function(b){d.append(b),e._forceReflow(d),e._transition(d).done(function(){g.resolveWith(d)}),a.contains(e.document[0].body,d[0])||g.resolveWith(d)},{maxWidth:f.previewMaxWidth,maxHeight:f.previewMaxHeight,canvas:f.previewAsCanvas})||g.resolveWith(d))&&g},_renderPreviews:function(b,c){var d=this,e=this.options;return c.find(".preview span").each(function(c,f){var g=b[c];e.previewSourceFileTypes.test(g.type)&&("number"!==a.type(e.previewSourceMaxFileSize)||g.size<e.previewSourceMaxFileSize)&&(d._processingQueue=d._processingQueue.pipe(function(){var b=a.Deferred();return d._renderPreview(g,a(f)).done(function(){b.resolveWith(d)}),b.promise()}))}),this._processingQueue},_renderUpload:function(a){return this._renderTemplate(this.options.uploadTemplate,a)},_renderDownload:function(a){return this._renderTemplate(this.options.downloadTemplate,a).find("a[download]").each(this._enableDragToDesktop).end()},_startHandler:function(b){b.preventDefault();var c=a(b.currentTarget),d=c.closest(".template-upload"),e=d.data("data");e&&e.submit&&!e.jqXHR&&e.submit()&&c.prop("disabled",!0)},_cancelHandler:function(b){b.preventDefault();var c=a(b.currentTarget).closest(".template-upload"),d=c.data("data")||{};d.jqXHR?d.jqXHR.abort():(d.errorThrown="abort",this._trigger("fail",b,d))},_deleteHandler:function(b){b.preventDefault();var c=a(b.currentTarget);this._trigger("destroy",b,a.extend({context:c.closest(".template-download"),type:"DELETE",dataType:this.options.dataType},c.data()))},_forceReflow:function(b){return a.support.transition&&b.length&&b[0].offsetWidth},_transition:function(b){var c=a.Deferred();return a.support.transition&&b.hasClass("fade")?b.bind(a.support.transition.end,function(d){d.target===b[0]&&(b.unbind(a.support.transition.end),c.resolveWith(b))}).toggleClass("in"):(b.toggleClass("in"),c.resolveWith(b)),c},_initButtonBarEventHandlers:function(){var b=this.element.find(".fileupload-buttonbar"),c=this.options.filesContainer;this._on(b.find(".start"),{click:function(a){a.preventDefault(),c.find(".start button").click()}}),this._on(b.find(".cancel"),{click:function(a){a.preventDefault(),c.find(".cancel button").click()}}),this._on(b.find(".delete"),{click:function(a){a.preventDefault(),c.find(".delete input:checked").siblings("button").click(),b.find(".toggle").prop("checked",!1)}}),this._on(b.find(".toggle"),{change:function(b){c.find(".delete input").prop("checked",a(b.currentTarget).is(":checked"))}})},_destroyButtonBarEventHandlers:function(){this._off(this.element.find(".fileupload-buttonbar button"),"click"),this._off(this.element.find(".fileupload-buttonbar .toggle"),"change.")},_initEventHandlers:function(){this._super(),this._on(this.options.filesContainer,{"click .start button":this._startHandler,"click .cancel button":this._cancelHandler,"click .delete button":this._deleteHandler}),this._initButtonBarEventHandlers()},_destroyEventHandlers:function(){this._destroyButtonBarEventHandlers(),this._off(this.options.filesContainer,"click"),this._super()},_enableFileInputButton:function(){this.element.find(".fileinput-button input").prop("disabled",!1).parent().removeClass("disabled")},_disableFileInputButton:function(){this.element.find(".fileinput-button input").prop("disabled",!0).parent().addClass("disabled")},_initTemplates:function(){var a=this.options;a.templatesContainer=this.document[0].createElement(a.filesContainer.prop("nodeName")),b&&(a.uploadTemplateId&&(a.uploadTemplate=b(a.uploadTemplateId)),a.downloadTemplateId&&(a.downloadTemplate=b(a.downloadTemplateId)))},_initFilesContainer:function(){var b=this.options;void 0===b.filesContainer?b.filesContainer=this.element.find(".files"):b.filesContainer instanceof a||(b.filesContainer=a(b.filesContainer))},_stringToRegExp:function(a){var b=a.split("/"),c=b.pop();return b.shift(),new RegExp(b.join("/"),c)},_initRegExpOptions:function(){var b=this.options;"string"===a.type(b.acceptFileTypes)&&(b.acceptFileTypes=this._stringToRegExp(b.acceptFileTypes)),"string"===a.type(b.previewSourceFileTypes)&&(b.previewSourceFileTypes=this._stringToRegExp(b.previewSourceFileTypes))},_initSpecialOptions:function(){this._super(),this._initFilesContainer(),this._initTemplates(),this._initRegExpOptions()},_create:function(){this._super(),this._refreshOptionsList.push("filesContainer","uploadTemplateId","downloadTemplateId"),this._processingQueue||(this._processingQueue=a.Deferred().resolveWith(this).promise(),this.process=function(){return this._processingQueue})},enable:function(){var a=!1;this.options.disabled&&(a=!0),this._super(),a&&(this.element.find("input, button").prop("disabled",!1),this._enableFileInputButton())},disable:function(){this.options.disabled||(this.element.find("input, button").prop("disabled",!0),this._disableFileInputButton()),this._super()}})});