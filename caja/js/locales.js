
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

function validarJornada() {
    
    $('#tabNavegacion').html(` `)
    db.ref(rutas.jornadas).orderByChild('numero').limitToLast(1).once('value', function(datosuser) {
        validacionJornada = false;
        datosuser.forEach(function(itemuser) {
            cajaBaseReferenciall
            
            db.ref(rutas.jornadas+itemuser.key).update({
                cajaBaseReferencial:cajaBaseReferenciall
            })

            
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