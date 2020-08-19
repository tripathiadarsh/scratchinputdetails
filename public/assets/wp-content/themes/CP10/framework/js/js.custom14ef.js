/*
*
* Author: Mark Fail
* Author URL: http://www.premiumpress.com
* Version: 10.x 
*
* THIS FILE WILL BE UPDATED WITH EVERY UPDATE
* IF YOU WANT TO MODIFY THIS FILE, CREATE A CHILD THEME
*
* http://codex.wordpress.org/Child_Themes
*/

	jQuery(window).on('load', function(){
									   
		 
		jQuery(window).on('scroll', function() {
											 
			
			if(jQuery('.previewmode').length){
				 
			}else{
			
			if(jQuery(this).scrollTop() > 150) {
				
				if(jQuery('.innerpage .has-sticky .elementor_topmenu').length){
				jQuery('.innerpage .has-sticky .elementor_topmenu').attr('style','display: none !important');
				}		 
				
				jQuery('.has-sticky').addClass('sticky');
				
			} else {
				
				if(jQuery('.innerpage .has-sticky .elementor_topmenu').length){
				jQuery('.innerpage .has-sticky .elementor_topmenu').attr('style','display: block !important');
				}
				
				jQuery('.has-sticky').removeClass('sticky');
			}
			
			}
			
		}); 
	
	});

	function checkSize(){
		
		 var wins = jQuery(window).width(); 
		 
		 setTimeout(function(){
							 
		if (wins  < 767){
		 	
			jQuery('.has-sticky .elementor_mainmenu').removeClass('fixed-scroll');			
			jQuery('.filters_sidebar .filter-content').addClass('collapse collapsexx').removeClass('show'); 

		}else if ( wins > 767){

			jQuery('.bg-gradient-smallx').removeClass('bg-gradient-smallx').addClass('bg-gradient-small');
			jQuery('.collapsexx').addClass('collapse show').removeClass('collapsexx');		
		}		 	
			
		}, 500);  		
		 
	}
  
 
  jQuery(document).ready(function(){ 
								  							
	"use strict";	
   
    checkSize();
   
    jQuery(window).resize(checkSize);
	
	/* MOBILE MENU	*/
  	jQuery(".menu-toggle").click(function(e) {
      e.preventDefault();
      jQuery("#wrapper").toggleClass("toggled");
    });	
	
	/*  PATTERNS */
	jQuery('section .bg-pattern').each(function () {		  
		jQuery(this).closest('section').addClass('with-pattern');		
	}); 

	 
	/*  FAVS	   */	
	jQuery(document).on("click",".favs_add", function (e) {
		
		var btnbit = jQuery(this);
		
		jQuery(this).removeClass('btn-icon').html("<i class='fas fa-spinner fa-spin'></i>");
		
		jQuery.ajax({
			type: "POST",
			url: ajax_site_url,	
			dataType: 'json',	
			data: {
				'action': "favs",
				'pid': jQuery(this).attr("data-pid"),				 
			},
			success: function(response) {
				 
				if(response.status == "add"){
					
						jQuery(btnbit).html('<i class="fa fa-heart"></i>'); 
				
				}else if(response.status == "remove"){
					
						jQuery(btnbit).html('<i class="fa fa-times-square"></i>');
				
				}else if(response.status == "login"){
					
						jQuery(btnbit).html('<i class="fa fa-user"></i>');
				
				}else{			
							
				}			
			},
			error: function(e) {
			   console.log('error getting search results');
			}
		}); 
		 
		  
	});	
	
	
	/*  SUBSCRIBE	*/ 	
	jQuery(document).on("click",".subscribe_add", function (e) {
		
		var btnbit = jQuery(this);
		
		jQuery(this).removeClass('btn-icon').html("<i class='fas fa-spinner fa-spin'></i>");
		
		jQuery.ajax({
			type: "POST",
			url: ajax_site_url,	
			dataType: 'json',	
			data: {
				'action': "subscribe",
				'uid': jQuery(this).attr("data-uid"),				 
			},
			success: function(response) {
				 
				if(response.status == "add"){
					
						jQuery(btnbit).html('<i class="fa fa-check"></i>'); 
				
				}else if(response.status == "remove"){
					
						jQuery(btnbit).html('<i class="fa fa-check"></i>');
				
				}else if(response.status == "login"){
					
						jQuery(btnbit).html('<i class="fa fa-user"></i>');
				
				}else{			
							
				}			
			},
			error: function(e) {
			   console.log('error getting search results');
			}
		}); 
		 
		  
	});
	 
	
	/*  IMAGRE BLOCK BUTTONS */
  	jQuery("figcaption button").click(function(e) {     
	  e.preventDefault();	  
	  window.location.href = jQuery(this).attr("data-link");
	  
    });
	
 
	/* WOW ANIMATIONS */
	jQuery('.block-cat-icon, .block-cat-text, .block-cat-faq').each(function () {
		 
		jQuery(this).find('i').addClass('wow fadeInUp').attr("data-wow-delay","0.1s");		
		jQuery(this).find('h2').addClass('wow fadeInUp').attr("data-wow-delay","0.2s");
		jQuery(this).find('h5').addClass('wow fadeInUp').attr("data-wow-delay","0.2s");
		
		jQuery(this).find('p').addClass('wow fadeInUp').attr("data-wow-delay","0.4s");
		
		jQuery(this).find('.btn').addClass('wow fadeInUp').attr("data-wow-delay","0.6s");
		
		
		jQuery(this).find('img').addClass('wow fadeInUp').attr("data-wow-delay","0.8s");
											   
	});
	 
	
	/*  WOW ANIMATION */
	new WOW().init();	  
	 
	/*  CUSTOM BACKGROUNDS */
	var a = jQuery(".bg-image");
    a.each(function (a) {
        if (jQuery(this).attr("data-bg")) jQuery(this).css("background-image", "url(" + jQuery(this).data("bg") + ")");
    });
	
	/*  CUSTOM PATTERNS */
	var a = jQuery(".bg-pattern");
    a.each(function (a) {
        if (jQuery(this).attr("data-bg")) jQuery(this).css("background-image", "url(" + jQuery(this).data("bg") + ")");
    });

	/*  CUSTOM PATTERNS */
	var a = jQuery(".bg-pattern-small");
    a.each(function (a) {
        if (jQuery(this).attr("data-bg")) jQuery(this).css("background-image", "url(" + jQuery(this).data("bg") + ")");
    }); 
	
	/* SCROLL TOO */
	if(jQuery(".scroll-init").lenght > 0){
		jQuery(".scroll-init div").singlePageNav({
			filter: ":not(.external)",
			updateHash: false,
			offset: 250,
			threshold: 250,
			speed: 1200,
			currentClass: "active"
		}); 
	}
     
    jQuery(".custom-scroll-link").on("click", function () {
        var a = 150 + jQuery(".scroll-nav-wrapper").height();
        if (location.pathname.replace(/^\//, "") === this.pathname.replace(/^\//, "") || location.hostname === this.hostname) {
            var b = jQuery(this.hash);
            b = b.length ? b : jQuery("[name=" + this.hash.slice(1) + "]");
            if (b.length) {
                jQuery("html,body").animate({
                    scrollTop: b.offset().top - a
                }, {
                    queue: false,
                    duration: 1200,
                    easing: "easeInOutExpo"
                });
                return false;
            }
        }
    });
	 	
	/* lazy load */
	var myLazyLoad = new LazyLoad({
		elements_selector: ".lazy"
	});
	
	/*  fade in */
	var IE='\v'=='v';jQuery("#back-top").hide();
		jQuery(window).scroll(function () {
			if (!IE) {
				if (jQuery(this).scrollTop() > 100) {
					jQuery('#back-top').fadeIn();
				} else {
					jQuery('#back-top').fadeOut();
				}
			}
			else {
				if (jQuery(this).scrollTop() > 100) {
					jQuery('#back-top').show();
				} else {
					jQuery('#back-top').hide();
				}	
			}
		});

		/*  scroll body to 0px on click */
		jQuery('#back-top a').click(function () {
			jQuery('body,html').animate({
				scrollTop: 0
			}, 800);
			return false;
		});
	
	/*  PAYMENT MODAL */
	jQuery(".payment-modal-close, .payment-modal-wrap-overlay").on("click", function (e) {
        jQuery(".payment-modal-wrap").fadeOut(400);		
    });
	
	/*  FINALL TRIGGER RESIZE FOR LOADERS ETC */
	tinyScroll();
	jQuery(".btn.next, .btn.prev").on("click", function (e) {
        tinyScroll();	
    });
	
	 

});
  
  
jQuery(window).bind("load", function() { 
	
	/*  LOAD IN THE SIDEBAR */
	jQuery("#sidebar-wrapper").show();
 
});
  
 
/* =============================================================================
	FUNCTION TO SCROLL 1PX AND TRIGGER THE LAZY LOAD
========================================================================== */	 

function tinyScroll() {
    window.scrollBy(0, 1);
}

/* =============================================================================
 FORM VALIDATION
  ========================================================================== */	 
function js_validate_fields(text){

	var canContinue = true;
 
	jQuery('.required-active').each(function(i, obj) {		
		jQuery(obj).removeClass('required-active');					  
	});	
	
 	jQuery('.required-field').each(function(i, obj) {		
				
		if(jQuery(obj).val() == ""){			
			jQuery(obj).addClass('required-active').focus();				
			canContinue = false;
		}		
	});
	
 	jQuery('.val-numeric').each(function(i, obj) {	
		 
		if(jQuery(obj).val() === "" ){				
			jQuery(obj).addClass('required-active').focus();				
			canContinue = false;
		}		
 
	});
	
	if(canContinue){
		return true;
	} else {
		alert(text);
		return false;
	}
} 
 
jQuery(document).on("input", ".numericonly, .val-numeric", function() {
    this.value = this.value.replace(/[^0-9\.]/g, '');
}); 