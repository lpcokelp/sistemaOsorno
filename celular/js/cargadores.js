function cargadorModulo(objeto, modulo, archivo) {
    $("#" + objeto).load("modulos/" + modulo + "/" + archivo + ".html");
}

function cargarBarra(objeto, modulo, archivo) {
    $("#" + objeto).load("modulos/" + modulo + "/" + archivo + ".html");
    console.log("Barra de navegacion operativa")
}