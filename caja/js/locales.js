rutaLocal="sistema/locales/"+sessionStorage.localcredencial+"/"
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
 db.ref(rutaLocal).on('value', function(datLocales) {
     if(datLocales.val().estado==true){
        //existe jornada activa
        sessionStorage.estadoLocal=true;
        console.log("local abierto")
     }else{
        sessionStorage.localactual=false;
        console.log("Local cerrado")
     }
        validacionJornada = false;

    
    })

function validarJornada() {
    
    $('#tabNavegacion').html(` `)
    db.ref(rutas.jornadas).orderByChild('numero').limitToLast(1).once('value', function(datosuser) {
        validacionJornada = false;
        datosuser.forEach(function(itemuser) {
          
        
            
            fechaJornadaActual=itemuser.val().fecha
            if (itemuser.val().estado == true) {
                validacionJornada = true;
                rutas.jornadaActual = itemuser.key;
            } else {
                validacionJornada = false
                cargadorModulo('app', 'jornada', 'inactiva')
            }
        })
        if (validacionJornada == true) {
            validacionJornada = true
            cargadorModulo('app', 'turnos', 'panelTurnos')
        } else {
            rutas.jornadaActual = '';
            cargadorModulo('app', 'jornada', 'inactiva')
        }
    })
}