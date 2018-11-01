rutaLocal="sistema/locales/"+sessionStorage.localcredencial+"/"
console.log(Math.floor(Math.random() ))
var fechaJornadaActual=""
function cargarprueba() {
    cargadorModulo('app', 'locales', 'localSeleccionado');
}

function cargarLocal(datos) {
    sessionStorage.localactual = datos;
    cargadorModulo('app', 'locales', 'localSeleccionado');
}

function abrirlocal() {
    cargadorModulo('app', 'locales', 'menulocal');
}

//sincronizar estado local
//medinte esta sincronizacion se verificará si existe una jornada activa


function sincronizarJornadas(local){
    console.log(local)
    db.ref(rutaLocal="sistema/locales/"+local).on('value', function(datosLocales) {
        console.log(local+" ->"+datosLocales.val().estado)
        if(datosLocales.val().estado==true){
           //existe jornada activa
           sessionStorage.estadoLocal=true;
           console.log("local abierto");
           cargadorModulo('app', 'turnos', 'panelTurnos')
        }else{
           sessionStorage.localactual=false;
           console.log("Local cerrado")
           cargadorModulo('app', 'jornada', 'inactiva')
        }
           validacionJornada = false;
   
       
       })
}

function validarJornada() {
  
    $('#tabNavegacion').html(` `)

        if ( sessionStorage.estadoLocal == true) {
            validacionJornada = true
            cargadorModulo('app', 'turnos', 'panelTurnos')
        } else {
            rutas.jornadaActual = '';
            cargadorModulo('app', 'jornada', 'inactiva')
        }

}