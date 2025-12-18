(function ($) {
    "use strict";
    
// JS Index
//----------------------------------------
// 1. preloader active
// 2.sticky menu
// 3. Animate the scroll to top
// 4. mobile-menu(mean-menu)
// 5. mobile-menu-sidebar
// 6. background image
// 7 quantity input arrow
// 8. header-shopping-cart
// 9. header-setting
// 10. header-language
// 11. header-currency
// 12. header-search
// 13. slider - active
// 14. showlogin toggle function
// 15. showcoupon toggle function
// 16. Create an account toggle function
// 17. Create an account toggle function
// 18. product-active
// 19. product-active2
// 20. product-active4
// 21. product-items-active
// 22. news-post-active
// 23. home5-news-post-active
// 24. brand-active
// 25. shop-product-slider-active
// 26. home2-product-active
// 27. home3-best-product-left-active
// 28. home2-best-product-left-active
// 29. product-carousal-active
// 30. blog-post-active
// 31. wow animation  active
// 32. nice selection
// 33. Countdown
// 34. news-like-post-active
// 35. accordion(sidebar)
// 36. Range Slider Js (shop sidebar)
// 37. product-zoom 
// 38. home3-best-product-left-active
//-------------------------------------------------

// 1. preloader active
// --------------------------------------------------------------------------
$(window).on("load", function () {
    $("#loading").fadeOut(0);
});



// 2.sticky menu
//---------------------------------------------------------------------------
var wind = $(window);
var sticky = $("#header-sticky");
wind.on('scroll', function () {
    var scroll = $(wind).scrollTop();
    if (scroll < 50) {
        sticky.removeClass("sticky-menu");
        $("#header-sticky").addClass("floating-menu");
    } else {
        sticky.removeClass("floating-menu");
        $("#header-sticky").addClass("sticky-menu");
    }
});



// 3. Animate the scroll to top
// --------------------------------------------------------------------------
// Show or hide the sticky footer button
$(window).on('scroll', function() {
    if($(this).scrollTop() > 600){
        $('#scroll').fadeIn(1000);
    } else{
        $('#scroll').fadeOut(1000);
    }
});

$('#scroll').on('click', function(event) {
    event.preventDefault();
    
    $('html, body').animate({
        scrollTop: 0,
    }, 1500);
});



// 4. mobile-menu(mean-menu)
//---------------------------------------------------------------------------
$("#mobile-menu").meanmenu({
    meanMenuContainer: ".mobile-menu",
    meanScreenWidth: "991",
});



// 5. mobile-menu-sidebar
//---------------------------------------------------------------------------
$(".mobile-menubar").on("click", function(){
    $(".side-mobile-menu").addClass('open-menubar');
    $(".body-overlay").addClass("opened");
});
$(".close-menu").click(function(){
    $(".side-mobile-menu").removeClass('open-menubar');
    $(".body-overlay").removeClass("opened");
});

$(".body-overlay").on("click", function () {
    $(".side-mobile-menu").removeClass('open-menubar');
    $(".body-overlay").removeClass("opened");
});



// 6. background image
//---------------------------------------------------------------------------
$("[data-background]").each(function (){
    $(this).css("background-image","url(" + $(this).attr("data-background") + ")");
});



// 7 quantity input arrow
//---------------------------------------------------------------------------      
$('.quantity-input').inputarrow({
    renderPrev: function(input) {
        return $('<span class="custom-next"><i class="fal fa-minus-circle"></i></span>').insertAfter(input);
    },
    renderNext: function(input) {
        return $('<span class="custom-prev"><i class="fal fa-plus-circle"></i></span>').insertBefore(input);
    },
    disabledClassName: 'enable'
});



// 8. header-shopping-cart
//---------------------------------------------------------------------------
$(".header-shopping-cart").on('click',function(){
    $(".header-shopping-cart-details").toggle();
});



// 9. header-setting
//---------------------------------------------------------------------------
$(".header-setting").on('click',function(){
    $(".header-setting-content").toggle();
});



// 10. header-language
//---------------------------------------------------------------------------
$(".language").on('click',function(){
    $(".show-language").toggle();
});



// 11. header-currency
//---------------------------------------------------------------------------
$(".currency").on('click',function(){
    $(".show-currency").toggle();
});



// 12. header-search
//---------------------------------------------------------------------------
$(".header-search").on("click",function(){
    $(".header-search-details").addClass('open-search-info');
});
$(".close-icon").click(function(){
    $(".header-search-details").removeClass('open-search-info');

});



// 13. slider - active
//---------------------------------------------------------------------------
function mainSlider() {
    var BasicSlider = $('.slider-active');

    BasicSlider.on('init', function (e, slick) {
        var $firstAnimatingElements = $('.single-slider:first-child').find('[data-animation]');
        doAnimations($firstAnimatingElements);
    });

    BasicSlider.on('beforeChange', function (e, slick, currentSlide, nextSlide) {
        var $animatingElements = $('.single-slider[data-slick-index="' + nextSlide + '"]').find('[data-animation]');
        doAnimations($animatingElements);
    });

    BasicSlider.slick({
        dots: false,
        fade: true,
        autoplay: true,
        autoplaySpeed: 3500,
        arrows: false,
        responsive: [
            { breakpoint: 767, settings: {} }
        ]
    });

    function doAnimations(elements) {
        var animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        elements.each(function () {
            var $this = $(this);
            var $animationDelay = $this.data('delay');
            var $animationType = 'animated ' + $this.data('animation');
            $this.css({
                'animation-delay': $animationDelay,
                '-webkit-animation-delay': $animationDelay
            });
            $this.addClass($animationType).one(animationEndEvents, function () {
                $this.removeClass($animationType);
            });
        });
    }
}
mainSlider();



// 14. showlogin toggle function
// ---------------------------------------------------------------------------
$('#login').on('click', function () {
	$('#checkout-login').slideToggle(900);
});



// 15. showcoupon toggle function
// ---------------------------------------------------------------------------
$('#couponshow').on('click', function () {
	$('#checkout-coupon').slideToggle(900);
});



// 16. Create an account toggle function
// ---------------------------------------------------------------------------
$('#cbox-account').on('click', function () {
	$('#cbox-account-info').slideToggle(900);
});



// 17. Create an account toggle function
// ---------------------------------------------------------------------------
$('#ship-box').on('click', function () {
	$('#ship-box-info').slideToggle(1000);
});



// 18. product-active
//---------------------------------------------------------------------------
$('.product-active').slick({
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 2,
    responsive: [
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 3,
            }
        },
        {
            breakpoint: 767,
            settings: {
                slidesToShow: 2,
            }
        },
        {
            breakpoint: 475,
            settings: {
                slidesToShow: 1,
            }
        }
    ]
});


// 19. product-active2
//---------------------------------------------------------------------------
$('.product-active2').slick({
    dots: false,
    arrows: false,
    infinite: true,
    autoplay:true,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 3,
            }
        },
        {
            breakpoint: 767,
            settings: {
                slidesToShow: 2,
            }
        },
        {
            breakpoint: 475,
            settings: {
                slidesToShow: 1,
            }
        }
    ]
});



// 20. product-active4
//---------------------------------------------------------------------------
$('.product-active4').slick({
    dots: false,
    arrows: true,
    infinite: true,
    slidesToShow: 5,
    autoplay:true,
    slidesToScroll: 1,
    prevArrow:'<b><i class="fas fa-angle-left l-a"></i></b>',
    nextArrow:'<b><i class="fas fa-angle-right r-a"></b>',
    responsive: [
        {
            breakpoint: 1200,
            settings: {
                slidesToShow: 4,
            }
        },
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 3,
            }
        },
        {
            breakpoint: 767,
            settings: {
                slidesToShow: 2,
            }
        },
        {
            breakpoint: 500,
            settings: {
                slidesToShow: 1,
            }
        }
    ]
});



// 21. product-items-active
//---------------------------------------------------------------------------
$('.product-items-active').slick({
    dots: false,
    arrows: false,
    infinite: true,
    autoplay:true,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 1200,
            settings: {
                slidesToShow: 3,
            }
        },
        {
            breakpoint:991,
            settings: {
                slidesToShow: 2,
            }
        },
        {
            breakpoint: 575,
            settings: {
                slidesToShow: 2,
            }
        },
        {
            breakpoint: 475,
            settings: {
                slidesToShow: 1,
            }
        }
    ]
});



// 22. news-post-active
//---------------------------------------------------------------------------
$('.news-post-active').slick({
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 2,
    responsive: [
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 2,
            }
        },
        {
            breakpoint: 767,
            settings: {
                slidesToShow: 1,
            }
        },
        {
            breakpoint: 576,
            settings: {
                slidesToShow: 1,
            }
        }
    ]
});



// 23. home5-news-post-active
//---------------------------------------------------------------------------
$('.home5-news-post-active').slick({
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 2,
    responsive: [
        {
            breakpoint: 1400,
            settings: {
                slidesToShow: 3,
            }
        },
        {
            breakpoint: 1200,
            settings: {
                slidesToShow: 3,
            }
        },
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 2,
            }
        },
        {
            breakpoint: 767,
            settings: {
                slidesToShow: 1,
            }
        },
        {
            breakpoint: 576,
            settings: {
                slidesToShow: 1,
            }
        }
    ]
});


// 24. brand-active
//---------------------------------------------------------------------------
$('.brand-active').slick({
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 6,
    slidesToScroll: 2,
    responsive: [
        {
            breakpoint: 1200,
            settings: {
                slidesToShow: 5,
            }
        },
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 4,
            }
        },
        {
            breakpoint: 700,
            settings: {
                slidesToShow: 3,
            }
        },
        {
            breakpoint: 567,
            settings: {
                slidesToShow: 2,
            }
        },
        {
            breakpoint: 420,
            settings: {
                slidesToShow: 1,
            }
        }
    ]
});



// 25. shop-product-slider-active
//---------------------------------------------------------------------------
$('.shop-product-slider-active').slick({
    dots: false,
    arrows: false,
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 2,
    responsive: [
        {
            breakpoint: 1199,
            settings: {
                slidesToShow: 2,
            }
        },
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 3,
            }
        },
        {
            breakpoint: 767,
            settings: {
                slidesToShow: 2,
            }
        },
        {
            breakpoint: 475,
            settings: {
                slidesToShow: 1,
            }
        }
    ]
});



// 26. home2-product-active
//---------------------------------------------------------------------------
$('.home2-product-active').slick({
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 3,
    responsive: [
        {
            breakpoint: 1200,
            settings: {
                slidesToShow: 4,
            }
        },
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 3,
            }
        },
        {
            breakpoint: 767,
            settings: {
                slidesToShow: 2,
            }
        },
        {
            breakpoint: 475,
            settings: {
                slidesToShow: 1,
            }
        }
    ]
});



// 27. home3-best-product-left-active
//---------------------------------------------------------------------------
$('.home3-best-product-left-active').slick({
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 2,
    responsive: [
        {
            breakpoint: 767,
            settings: {
                slidesToShow: 1,
            }
        }
    ]
});



// 28. home2-best-product-left-active
//---------------------------------------------------------------------------
$('.home2-best-product-left-active').slick({
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 2,
    responsive: [
        {
            breakpoint: 475,
            settings: {
                slidesToShow: 1,
            }
        }
    ]
});



// 29. product-carousal-active
//---------------------------------------------------------------------------
$('.product-carousal-active').slick({
    dots: false,
    arrows: true,
    prevArrow:'<b><i class="icon-chevron-left l-a"></i></b>',
    nextArrow:'<b><i class="icon-chevron-right r-a"></b>',
    infinite: true,
    slidesToShow: 3,
    slidesToScroll:1,
    responsive: [
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 2,
            }
        },
        {
            breakpoint: 475,
            settings: {
                slidesToShow: 1,
            }
        }
    ]
});


// 30. blog-post-active
//---------------------------------------------------------------------------
$('.blog-post-active').slick({
    dots: false,
    arrows: true,
    prevArrow:'<b><i class="icon-chevron-left l-a"></i></b>',
    nextArrow:'<b><i class="icon-chevron-right r-a"></b>',
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 475,
            settings: {
                slidesToShow: 1,
            }
        }
    ]
});


// 31. wow animation  active
// ---------------------------------------------------------------------------
new WOW().init();



// 32. nice selection
//---------------------------------------------------------------------------
$('select').niceSelect();


// 33. Countdown
//---------------------------------------------------------------------------
$('[data-countdown]').each(function() {
    var $this = $(this), finalDate = $(this).data('countdown');
    $this.countdown(finalDate, function(event) {
        $this.html(event.strftime('<span class="cdown days"><span class="time-count">%-D</span> <p>Days</p></span> <span class="cdown hour"><span class="time-count">%-H</span> <p>Hour</p></span> <span class="cdown minutes"><span class="time-count">%M</span> <p>Min</p></span> <span class="cdown second"> <span><span class="time-count">%S</span> <p>Sec</p></span>'));
    });
});


// 34. news-like-post-active
//---------------------------------------------------------------------------
$('.news-like-post-active').slick({
    dots: false,
    arrows: true,
    prevArrow:'<b><i class="icon-chevron-left l-a"></i></b>',
    nextArrow:'<b><i class="icon-chevron-right r-a"></b>',
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 2,
    responsive: [
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 2,
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
            }
        },
        {
            breakpoint: 400,
            settings: {
                slidesToShow: 1,
            }
        }
    ]
});



// 35. accordion(sidebar) 
//---------------------------------------------------------------------------
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    } 
  });
}




// 36. Range Slider Js (shop sidebar)
//---------------------------------------------------------------------------
if ($("#slider-range").length) {
    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 500,
        values: [0, 400.00],
        slide: function (event, ui) {
            $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
        }
    });
    $("#amount").val("$" + $("#slider-range").slider("values", 0) +
        " - $" + $("#slider-range").slider("values", 1));

}


// 37. product-zoom 
//---------------------------------------------------------------------------
    $(".product-zoom").elevateZoom({
        zoomType: "inner",
        cursor: "crosshair"
    });


// 38. home3-best-product-left-active
//---------------------------------------------------------------------------
$('.testimonial-active').slick({
    dots: true,
    arrows: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
});



})(jQuery);	  
