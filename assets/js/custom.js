/**
 * PIXBUILDER
 * By PixFort
 * Copyright 2017
 * www.pixfort.com
 */

$( window ).load(function() {

	// add the animation to the modal
	$( ".modal" ).each(function(index) {
		var self = $(this);
		$(this).on('show.bs.modal', function (e) {
			$(this).addClass('in');
        	$(this).find('.modal-dialog').velocity('transition.fadeIn');
       		$(this).show();
		});
		$(this).on('hide.bs.modal', function (e) {
			$(this).find('.modal-dialog').velocity('transition.fadeOut');
			$(this).removeClass('in');
			var self = this;
			$(this).delay(500).queue(function() {
		     	$(self).hide();
				$(this).dequeue();
		  	});
			$('body').removeClass('modal-open');
			e.stopPropagation();
	    	e.preventDefault();
	    	return false;
		});
		if(self.hasClass('pix_popup')&&self.attr('data-wait')&&self.attr('data-wait')!=''){
            var wait_time = self.attr('data-wait')*1000;
            setTimeout(
                function(){
                    self.modal('show');
                }, wait_time);
        }
	});


	$("form.pixfort-form").on( "submit", function( event ) {
        event.preventDefault();
        var values = {};
        var temp_str = "";
        var theform = this;
        var proceed = true;
        var is_confirm = false;
        var confirm_pop = "";
        var is_redirect = false;
        var redirect_link = "";
        var have_type = false;
        var the_type = "";
        var the_list = "";
        var have_list = false;
        $('.alert').slideUp();
        if($(theform).attr('pix-confirm')){
            confirm_pop = $(theform).attr('pix-confirm');
            is_confirm = true;
        }
        if($(theform).attr('pix-redirect')){
            redirect_link = $(theform).attr('pix-redirect');
            is_redirect = true;
        }
        if($(theform).attr('pix-form-type')){
            if(($(theform).attr('pix-form-type')!='') && ($(theform).attr('pix-form-type')!='#' )){
                the_type = $(theform).attr('pix-form-type');
                have_type = true;
            }
        }
        if($(theform).attr('pix-form-list')){
            if($(theform).attr('pix-form-list')!=''){
                the_list = $(theform).attr('pix-form-list');
                have_list = true;
            }
        }
        $("input, textarea, select").css('border-color','');
        $.each($(theform).serializeArray(), function(i, field) {
            values[pix_replace_chars(field.name)] = field.value;
            temp_str += pix_replace_chars(field.name) + ": " + field.value + "\n";
            if(field.value=="" && $(field).attr('required')){
            	field.css('border-color','red');
                proceed = false;
            }
        });
        if(proceed){
            if(have_type){ values['pixfort_form_type'] = the_type; }
            if(have_list){ values['pixfort_form_list'] = the_list; }
            var post_data;
            var output;
            $.post('pix_mail/new_contact.php', values, function(response){
                $(theform).find('.alert').remove();
                if(response.type == 'error'){
                	var alert_msg = '<div class="alert alert-danger" role="alert" style="display:none;">'+response.text+'</div>';
                	$(theform).prepend(alert_msg);
                	$('.alert').slideDown();
                }else{
                    if(is_confirm){ $("#" + confirm_pop).modal('show'); }
                    if(is_redirect){ window.location.href = redirect_link; }
                    var alert_msg = '<div class="alert alert-success" role="alert" style="display:none;">'+response.text+'</div>';
                	$(theform).prepend(alert_msg);
                	$('.alert').slideDown();
                    $(theform).find('input').val('');
                    $(theform).find('input').css('border-color','');
                    $(theform).find('textarea').val('');
                }
            }, 'json');
        }
    });
	$("input, textarea, select").keyup(function() {
		$(this).css('border-color','');
        $('.alert').slideUp();
    });

		$('.pix-countdown').each(function(){
        var self = $(this);
        var endDate = $(this).attr('data-date');
        self.countdown({
            date: endDate,
            render: function(data) {
                $.each(data, function(key, value) {
                    self.find('.pix-count-'+key).html(value);
                });
            },
            onEnd: function(){
                if($(this.el).attr('data-redirect')){
                    window.location.href = $(this.el).attr('data-redirect');
                }
                if($(this.el).attr('data-popup')){
                    $($(this.el).attr('data-popup')).modal('show');
                }
            }
        });
    });

});


// ===========================================================
// Functions
// ===========================================================

$(document).ready(function() {
	var yourNavigation = $(".pix_nav_menu");
	stickyDiv = "sticky";
	yourHeader = 200;

	$(window).scroll(function() {
	if( $(this).scrollTop() > yourHeader ) {
		yourNavigation.addClass(stickyDiv);
	} else {
		yourNavigation.removeClass(stickyDiv);
	}
	});

	$(".navbar-toggle").click(function(){
		$(".menu").toggleClass("show");
	});

	function scrollToSection(event) {
		event.preventDefault();
		var $section = $($(this).attr('href')); 
		$('html, body').animate({
		  scrollTop: $section.offset().top - 60
		}, 1000);
	  }
	$('.nav-item a').on('click', scrollToSection);
});

function pix_scroll_menu(){
	if($('.pix_scroll_header').length>0){
		var scroll_bg = 'background: #8E552A;';
		if($('.pix_scroll_header').attr('data-scroll-bg')){
			scroll_bg;
		}
		var nav_menu = '';
		if($('#pix-header-nav').length>0){
			nav_menu = $('<div>').append($('#pix-header-nav').clone().attr('id', 'pix-scroll-nav').addClass('navbar-right').addClass('pix-adjust-scroll').css('margin-top', 0)).html();
		}
		var header_btn = false;
		var header_btn_div = "";
		if($('#pix-header-btn').length>0){
			header_btn_div = '<div class="col-md-2"><div class="pix-content pix-adjust-scroll text-right">';
			var btns = $('#pix-header-btn').clone();
			btns.find('a').css('margin-top',0);
			header_btn_div += btns.html();
			header_btn_div += '</div></div>';
			header_btn=true;
		}

		var scroll_col = "col-md-12";
		if(header_btn){
			scroll_col = "col-md-10";
		}

		var sh2 = '<div class="pix_scroll_menu pix_menu_hidden" style="padding: 10px 0;'+scroll_bg+'">'+
							'<div class="container">'+
								'<div class="row">'+
									'<div class="pix-inner-col '+scroll_col+'">'+
										'<div class="pix-content">'+
											'<nav class="navbar navbar-default pix-no-margin-bottom pix-navbar-default">'+
												'<div class="container-fluid">'+
													'<div class="navbar-header">'+
														'<div class="navbar-brand pix-adjust-scroll"><a class="logo-img logo-img-a pix-adjust-height" href="#"><img src="assets/images/media_indonesia.png" alt="logo header" class="scroll_logo_mi" height="40"></a><a class="logo-img logo-img-a pix-adjust-height" href="#"><img src="assets/images/lima.png" alt="logo lima" class="scroll_logo_mi" height="40"></a></div>'+
														'<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">'+
															'<img src="assets/images/icon_menu.png" alt="icon" width="35">'+
														'</button>'+
													'</div>'+
													'<div class="collapse navbar-collapse">'+
															nav_menu+
													'</div>'+
												'</div>'+
											'</nav>'+
										'</div>'+
									'</div>';
									if(header_btn){
										sh2 += header_btn_div;
									}
								sh2+='</div>'+
							'</div>'+
						'</div>'+
					'</div>';
		$('body').append(sh2);
		pix_fix_scroll_heights();
	}
}


function pix_fix_heights(){
	var max_h = 0;
	$('.pix-adjust-height').each(function(item){
		if($(this).outerHeight()>max_h){max_h=$(this).outerHeight();}
	});
	if(max_h>0){
		var logo_h = $('.logo-img-a').outerHeight();
		$('.pix-adjust-height').each(function(item){
			var item_h = +$(this).outerHeight();
			if(item_h<max_h){
				var diff = max_h - item_h;
				diff /=2;
				$(this).css('margin-top', diff);
			}
		});
	}
}
function pix_fix_scroll_heights(){
	var max_h = 0;
	$('.pix-adjust-scroll').each(function(item){
		if($(this).outerHeight()>max_h){max_h=$(this).outerHeight();}
	});
	if(max_h>0){
		var logo_h = $('.logo-img-a').outerHeight();
		$('.pix-adjust-scroll').each(function(item){
			var item_h = +$(this).outerHeight();
			if(item_h<max_h){
				var diff = max_h - item_h;
				diff /=2;
				$(this).css('margin-top', diff);
			}
		});
	}
}


function pix_disable_nav_click(){
	$('.pix_scroll_menu, .pix_nav_menu').find(".dropdown, .btn-group").on('click', function(e){
		if($(window).width()>768){
			e.stopPropagation();
	    	e.preventDefault();
	    	return false;
    	}
	});
}

function pix_replace_chars(string){
	return string.replace(/[^a-zA-Z0-9]/g,'_');
}
