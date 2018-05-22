// Usaremos import con scrollreveal y tweenmax que estan en node_modules
import {Tweenmax} from "gsap";
import {scrollreveal} from "scrollreveal";
// Creamos la timeline de modo que tengamos varias animaciones para las partes y logo
var tl = new TimelineMax();
tl.fromTo("#a-d", 2, {x: "-150%", y: "-150%"}, {x: "0%", y:"0%", ease: Circ.easeInOut});
tl.fromTo("#abajo", 2, {x: "250%", y: "0%"}, {x: "0%", y:"0%", ease: Circ.easeInOut}, "-=2");
tl.fromTo("#a-i", 2, {x: "-150%", y: "150%"}, {x: "0%", y:"0%", ease: Circ.easeInOut}, "-=2");

// TweenMax.lagSmoothing(0);

// Recojemos los id de cada parte y los metemos a un array
var IDs = $('.parte[id]').map(function(){
    return this.id;
}).get();

// Recojemos la prpiedad width de cada parte y lo agregamos a un array
var widths = $('.parte').map(function(){
    return $(this).width();
}).get();

for(var i = 0; i<$(".parte").length; i++){
    // var width = IDs[i].width();
    // console.log(widths[i]);
    tl.fromTo("#"+IDs[i], .3,{width: "0px"}, {width: widths[i], ease: Back.easeOut});
    // Con nuestro ciclo, contando de 0 a 8 (numero de partes), crearemos un total de 8 animaciones con Tweenmax
    // Gracias a que hicimos una linea del tiempo, nuestro ciclo creara mas d euna animacion, para asi, aparecer cada parte por separado
}

// Añadimos un callback a la linea del tiempo para quitar el overflow hidden

tl.addCallback(function(){
    $("body").css({
        "overflow": "visible"
    });
});

// ------- Parallax inicio --------------

// Operamos en el evento "mousemove", es decir, en el movimiento del mouse
$(".banner").on('mousemove',function(e){

    // Le quitamos la animacion de flotar
    var windowWidth = $(window).width();
    if(windowWidth > 1200){
        $(".partes .parte").css({
            "animation": "none"
        });
    
        // Obtenemos el ancho de la ventana
        var wx = $(window).width();
        // Obtenemos el alto de la ventana
        var wy = $(window).height();
    
        // event.page$ -> la coordenada donde se encuentra el mouse
        // .offset[$] -> el espacio que tiene en el lado especificado "[$]", por ejemplo, el espacio que tiene banner de left + margin, en este caso 0
    
        // Por lo tanto a la coordenada (ya sea x o y) le restamos el espacio que tiene "banner"
        var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop;
    
        // Dividimos por la mitad el ancho y el alto de la ventana y se los restamos a la variable x, y
        // Al no haber offset por ningun lado, mas bien seria decir que le restamos a las coordenadas
        var newx = x - wx/2;
        var newy = y - wy/2;
    
        // console.log(newx + " , "+ newy);
    
        // Accedemos a cada parte
        $(".partes .parte").each(function(){
            // Y creamos una funcion anonima, lo primero que hacemos es recoger la velocidad del atributo que creamos "data-speed"
            var speed = $(this).attr("data-speed");
    
            // Si nuestro otro atributo creado "data-revert" es verdadero, la velocidad la pondremos negativa de modo que se mueva para el lado contrairo
            if($(this).attr("data-revert")) speed *= -1;
            // Utilizamos TweenMax de GreenSock para crear la animacion
            TweenMax.to($(this), 1, {x: (1 - newx*speed ), y: (1 - newy * speed) });
            //          [Target], [delay], [propiedades editadas]
            //  Nuestro target es ".parte", con un delay de 1 segundo y editamos la posicion x, y de la parte
            // Obtenemos los valores editados con la posicion creada en X multiplicada por la velocidad que le pasamos, lo mismo para Y
        });
    }


});



// Parallax de main

$(window).scroll(function(){

    var ventanaWidth = $(window).width();
    if(ventanaWidth > 800){

        var scroll = $(window).scrollTop();

        $(".motor").css({
            'transform': "translate(0px,-"+ scroll/8 +"%)"
        });
    }
});

$(window).resize(function(){
    var ventanaWidth = $(window).width();

    if(ventanaWidth < 800){
        $('.motor').css({
            'transform': "translate(0px, 0px)"
        });
    }
});




$(window).on('beforeunload', function() {
    $(window).scrollTop(0);
 });