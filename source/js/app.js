// Usaremos import con scrollreveal y tweenmax que estan en node_modules
import $ from 'jquery';
import 'slick-carousel';
import {Tweenmax} from "gsap";
import {scrollreveal} from "scrollreveal";


$(window).on('beforeunload', function() {
    $(window).scrollTop(0);
 });

 $(document).ready(function(){
    // Creamos la timeline de modo que tengamos varias animaciones para las partes y logo
    var tl = new TimelineMax();
    // tl.fromTo("#a-d", 2, {x: "-150%", y: "-150%"}, {x: "0%", y:"0%", ease: Circ.easeInOut});
    // tl.fromTo("#abajo", 2, {x: "250%", y: "0%"}, {x: "0%", y:"0%", ease: Circ.easeInOut}, "-=2");
    // tl.fromTo("#a-i", 2, {x: "-150%", y: "150%"}, {x: "0%", y:"0%", ease: Circ.easeInOut}, "-=2");
    tl.fromTo("#a-d", 2, {x: "-1000%", y: "-1000%"}, {x: "-150%", y:"-112%", ease: Circ.easeInOut});
    tl.fromTo("#abajo", 2, {x: "1000%", y: "0%"}, {x: "-85%", y:"-600%", ease: Circ.easeInOut}, "-=2");
    tl.fromTo("#a-i", 2, {x: "-1000%", y: "1000%"}, {x: "-170%", y:"-112%", ease: Circ.easeInOut}, "-=2");

    // TweenMax.lagSmoothing(0);

    // Añadimos un callback a la linea del tiempo para quitar el overflow hidden

    tl.addCallback(function(){
        $("body").css({
            "overflow": "visible"
        });

        $('html, body').animate({
            scrollTop: $('#main').offset().top - $(".navegacion").height() +"px"
        },700);

    });


    const deskBp = matchMedia('(min-width: 1200px)');

    const changeSize = (desk) => {
        if(desk.matches){

            $(window).scroll(function(){

                var ventanaWidth = $(window).width();
                if(ventanaWidth > 991){
                
                    var scroll = $(window).scrollTop();
                
                    $(".motor").css({
                        'transform': "translate(0px,-"+ scroll/8 +"%)"
                    });
                }
            });

        }
    }

    deskBp.addListener(changeSize);
    changeSize(deskBp);


    $(window).resize(function(){
        var ventanaWidth = $(window).width();

        if(ventanaWidth < 991.98){
            $('.motor').css({
                'transform': "translate(0px, 0px)"
            });
        }
    });

    let $window = $(window);
    let nav = $('.navegacion');

    $window.on('scroll', () => {
        let scrollTop = $window.scrollTop();
        nav.toggleClass('salir', scrollTop > 500);
    });

    $("#hamburguer-menu").on('click', () => {
        $("#hamburguer-menu").toggleClass('abierto');
        $(".items").slideToggle();
    });


    // Anclas
    var $root = $('html, body');

    $('a[href^="#"]').on('click', function(){
        $root.animate({
            scrollTop: $($.attr(this, 'href')).offset().top - 87
        }, 500);
    });

    let carousel = $("#carou");
    carousel.slick({
        arrows: true,
        prevArrow: $('.carou__btn__button--left'),
        nextArrow: $('.carou__btn__button--right')
    });


});