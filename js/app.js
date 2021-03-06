/**
* Config
*/
var viewportHeight;
/**
* Fading header
*/
var timeoutFadingHeader,
	isHeaderFading = false,
	fadingHeader,
	durationNavAnim = 250,
	durationNavHide = 500;
/**
* Page Loader
*/
var pageloadDelay = 1000,
	documentScrollTop,
	mainPageId = '#main-page',
	loader = new SVGLoader($('#loader')[0], { speedIn : 400, easingIn : mina.easeinout } );
	
/**
* Contact form
*/
var nameVal, 
    email,
    msg;
/**
* Google Maps
*/
var googleMap,
	googleMapMarker,
	companyLocation,
	markerInfowindow,
	returnToMarkerTimeout;
/**
* 
*/
var sliderImages = [
	'aboutus1.jpg',
	'aboutus2.JPG',
	'aboutus3.jpg',
	'aboutus4.jpg',
	];

/**
* On Ready
*/
$(function(){
	// Foundation
	$(document).foundation();

	// set up hover panels
	// although this can be done without JavaScript, we've attached these events
	// because it causes the hover to be triggered when the element is tapped on a touch device
	$('.hover').hover(function(){
	    this.classList.toggle('flip');
	});

	/**
	* Fading header
	*/
	viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	FadingHeader.init();

	/**
	* PageLoader
	*/
	initPageLoader();

        /**
	* Contact Form
	*/
    ContactForm.init();
});



function loadAfterPreLoad(){
	homeLoad();
		$('.slider').slick({
		    autoplay: true,
		    autoplaySpeed: 2000,
		});

		$('.slick-slide').each(function(index, element){
			index = index > sliderImages.length ? 1 : 
				index <= 0 ? sliderImages.length : index;
			$(element).backstretch('../img/' + sliderImages[index - 1]);
		});
}

function homeLoad(){
		$('#home-logo').css({
			opacity: 1,
			marginTop: '100px',
		});	
		$('#subtitle-1').css({
			opacity: 1,
			marginTop: '0px',
		});	
		$('#subtitle-2').css({
			opacity: 1,
		});	
		$('.static-header').css({
			opacity: 1,
		});	
}

/**
* Fading header
*/
var FadingHeader = {
	init: function(){
		$('body').fragmentScroll();

		fadingHeader = $('.fading-header');
		viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

		$(document).scroll(function(){
			if(!isElementInViewport(this.documentElement)){

				if(fadingHeader.css("opacity") == '1' && isHeaderFading){
					clearTimeout(timeoutFadingHeader);
					isHeaderFading = false;
				}
				else if(fadingHeader.css("opacity") == '0'){
					FadingHeader.show();
				}
			}
			else{
				if(fadingHeader.css("opacity") == '1' && !isHeaderFading){
					isHeaderFading = true;
					clearTimeout(timeoutFadingHeader);
					timeoutFadingHeader = setTimeout(function(){
							FadingHeader.hide();
							isHeaderFading = false;
					}, durationNavHide);
				}
			}
		});
	},
	hide: function(){
		fadingHeader.animate({
			opacity: 0,
			marginTop: '-45px',
		}, durationNavAnim);
	},
	show: function(){
		fadingHeader.animate({
			opacity: 1,
			marginTop: '0px'
		}, durationNavAnim);
	},
};

/**
* General Functions
*/
function isElementInViewport (el) {
    if (el instanceof jQuery) {
        el = el[0];
    }
    var rect = el.getBoundingClientRect();
    return rect.bottom > 50;
}

function isEmail(email) {
    var character = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return character.test(email);
}

	
/**
* Case Studies
*/
function initPageLoader() {
	$('.pageload-link').on('click', function(ev){
		// ev.preventDefault();
		loader.show();
		$thisObj = $(this);

		// after some time hide loader
		setTimeout( function() {
			loader.hide();

			var origin = $thisObj.data('pageOrigin');
			if(origin == mainPageId) documentScrollTop = $(document).scrollTop();
			$origin = $(origin)[0].classList.toggle('show');

			var destination = $thisObj.data('pageDestination');
			$destination = $(destination)[0].classList.toggle('show');
			if(destination == mainPageId) $(document).scrollTop(documentScrollTop);
		}, pageloadDelay);
	});

	var tmpSpeedIn = loader.options.speedIn;
	loader.options.speedIn = 0;
	loader.show();

	setTimeout(function(){
		loader.options.speedIn = tmpSpeedIn;
		loader.hide();
		$('#main-page')[0].classList.toggle('show');
		$('#footer')[0].classList.toggle('show');

		$('#home-bg-transparent').css('backgroundColor', 'rgba(0,0,0,0.4)');
		$('#img-paralax').backstretch("../img/scrum-wall2.jpeg");	

		  $('div[data-type="background"]').each(function(){
		      var $thisObj = $(this);
		      var $bgobj = $thisObj.find('.backstretch img'); // assigning the object
		      
		      $(window).scroll(function() {
		            var yPos = -($(this).scrollTop() / $thisObj.data('speed'));
		            $bgobj.css({marginTop: Math.round(-yPos * 5) + 'px'});
		        });
		    }); 	
		
		setTimeout('loadAfterPreLoad()', pageloadDelay);
		setTimeout('initGoogleMap()', pageloadDelay * 2);
	}, pageloadDelay);
}

/**
* Contact Form -- create object
*/

var ContactForm = {
	init: function(){

	if(!nameVal){
		nameVal = $('#nameVal');
		email = $('#email');
		msg = $('#msg');
	}

 	$('#contact-form').submit(function(e){
		if(this.checkValidity()){
			e.preventDefault();
	 		if(nameVal.val() && email.val() && msg.val() && isEmail(email.val())){
	 			$.ajax({
	 				type: "POST",
	 				url: 'https://docs.google.com/a/bywave.com.au/forms/d/1IYvB6JIlq6hqqlh2NGv40N8LF03dSexc_yaBc9HMrZg/formResponse',
	 				data: $(this).serializeArray(),
	 				dataType: 'xml',
	 				statusCode: {
	 					0: function (){
                                ContactForm.clearContactFields();
	 						ContacForm.displaySuccess();
	                        //Success message
	                    },
	                    200: function (){
                                ContactForm.clearContactFields();
	                        //Success Message
                                ContactForm.displaySuccess();
	                    }
	                }	
	            });
	 		}
	 		else{
	 			if(!nameVal.val()){
	 				nameVal.addClass('show-error');
	 				$('.error.prompt.reqname').animate({opacity: 1}, 'fast');
	 			}
				if(!email.val()){
					email.addClass('show-error');
					$('.error.prompt.reqemail').animate({opacity: 1}, 'fast')
				}
				else if(!isEmail(email.val())){
					email.addClass('show-error');
					$('.error.prompt.invemail').animate({opacity: 1}, 'fast');
				}
 				if(!msg.val()){
 					msg.addClass('show-error');
 					$('.error.prompt.reqmsg').animate({opacity: 1}, 'fast');
 				}
                    ContactForm.setTimeoutError();
			}
		}
 	});
	},
	displaySuccess: function(){
		$('.success-message').fadeIn();
	},
	setTimeoutError: function(){
		setTimeout(function(){
				nameVal.removeClass('show-error');
				email.removeClass('show-error');
				msg.removeClass('show-error');
			$('.error.prompt').animate({opacity: 0}, 'fast');
		}, 3000);
	},
	clearContactFields: function(){
		nameVal.val("");
		email.val("");
		msg.val("");
		$('#contact-form').animate({opacity: 0}, 'fast');
	},
	validateEmail : function(emailVal){
		if(!isEmail(emailVal) && email != ''){		
			email.addClass('show-error');
			$('.error.prompt.invemail').animate({opacity: 1}, 'fast');
            ContactForm.setTimeoutError();
		}
	},
};

/**
* GoogleMaps
*/
function initGoogleMap(){
	companyLocation = new google.maps.LatLng(7.0622092,125.609086);

	googleMap = new google.maps.Map(document.getElementById("google-map"), {
		center: companyLocation,
		zoom: 16,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		// disableDefaultUI: true,
		streetViewControl: false,
		panControl: false,
    	mapTypeControl: false,
		scrollwheel: false,
		styles: [
				    {
				        "featureType": "landscape",
				        "stylers": [
				            {
				                "saturation": -100
				            },
				            {
				                "lightness": 65
				            },
				            {
				                "visibility": "off" //on
				            }
				        ]
				    },
				    {
				        "featureType": "poi",
				        "stylers": [
				            {
				                "saturation": -100
				            },
				            {
				                "lightness": 51
				            },
				            {
				                "visibility": "simplified"
				            }
				        ]
				    },
				    {
				        "featureType": "road.highway",
				        "stylers": [
				            {
				                "saturation": -100
				            },
				            {
				                "lightness": 0
				            },
				            {
				                "visibility": "simplified"
				            }
				        ]
				    },
				    {
				        "featureType": "road.arterial",
				        "stylers": [
				            {
				                "saturation": 100 //-100
				            },
				            {
				                "hue": "#F58220"
				            },
				            {
				                "lightness": -25 //30
				            },
				            {
				                "visibility": "on"
				            }
				        ]
				    },
				    {
				        "featureType": "road.local",
				        "stylers": [
				            {
				                "saturation": -100
				            },
				            {
				                "lightness": 0 //40
				            },
				            {
				                "visibility": "on"
				            }
				        ]
				    },
				    {
				        "featureType": "transit",
				        "stylers": [
				            {
				                "saturation": -100
				            },
				            {
				                "visibility": "simplified"
				            }
				        ]
				    },
				    {
				        "featureType": "administrative.province",
				        "stylers": [
				            {
				                "visibility": "off"
				            }
				        ]
				    },
				    {
				        "featureType": "water",
				        "elementType": "labels",
				        "stylers": [
				            {
				                "visibility": "on"
				            },
				            {
				                "lightness": -25
				            },
				            {
				                "saturation": -100
				            }
				        ]
				    },
				    {
				        "featureType": "water",
				        "elementType": "geometry",
				        "stylers": [
				       		{
				                "visibility": "off" //on
				            },
				            {
				                "hue": "#ffff00"
				            },
				            {
				                "lightness": -25
				            },
				            {
				                "saturation": -97
				            }
				        ]
				    }
				],
	});
	
	googleMapMarker = new google.maps.Marker({
	    position: companyLocation,
	    map: googleMap,
	    // animation: google.maps.Animation.BOUNCE,
	});

	markerInfowindow = new google.maps.InfoWindow({
      content: '<div>asdadas</div>',
  	});

	// markerInfowindow.open(googleMap, googleMapMarker);
 //  	google.maps.event.addListener(googleMapMarker, 'click', function() {
	// 	//closed
	//     if(markerInfowindow.getMap() == null){
	//     	markerInfowindow.open(googleMap, googleMapMarker);
	//     }
	//     else{
	//     	markerInfowindow.close();
	//     }
	// });

  	google.maps.event.addListener(googleMap, 'center_changed', function() {
	    // 3 seconds after the center of the map has changed, pan back to the
	    // marker.
	    clearTimeout(returnToMarkerTimeout);
	    returnToMarkerTimeout = setTimeout(function() {
	    	googleMap.panTo(googleMapMarker.getPosition());
	    	// if(markerInfowindow.getMap() == null) markerInfowindow.open(googleMap, googleMapMarker);
	    }, 10000);
	});
}