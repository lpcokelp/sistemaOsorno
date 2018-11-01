rutaCuadratura = rutas.jornadas + rutas.jornadaActual + "/turnos/" + rutas.turnoactual + "/datosTurno/"

function cargarDatosCuadratura() {
    db.ref(rutaCuadratura).once('value', function(icuadratura) {
        cajabaseCuadratura = 0;
        retirocajabaseCuadratura = 0;
        recaudacionesCuadratura = 0;
        premiosCuadratura = 0;
        gastosCuadratura = 0;
        balanceCuadratura = 0;
        efectivoCuadratura = 0;
        cajabaseCuadratura = parseInt(icuadratura.val().cajabasetotal);
        retirocajabaseCuadratura = parseInt(icuadratura.val().retiroCajabasetotal);
        recaudacionesCuadratura = parseInt(icuadratura.val().recaudacionesTotales)
        premiosCuadratura = parseInt(icuadratura.val().premiosTotales)
        gastosCuadratura = parseInt(icuadratura.val().gastosTotales)
        balanceCuadratura = recaudacionesCuadratura - gastosCuadratura - premiosCuadratura;
        efectivoCuadratura = balanceCuadratura + cajabaseCuadratura - retirocajabaseCuadratura;
        //if ($("#cuadratura").is(":visible")) {
        //$('#retirocajabaseCuadratura').html(puntos("" + retirocajabaseCuadratura + ""))
        $('#cajabaseCuadratura').html(puntos("" + cajabaseCuadratura + ""))
        $('#recaudacionesCuadratura').html(puntos("" + recaudacionesCuadratura + ""))
        $('#premiosCuadratura').html(puntos("" + premiosCuadratura + ""))
        $('#gastosCuadratura').html(puntos("" + gastosCuadratura + ""))
        $('#balanceCuadratura').html(puntos("" + balanceCuadratura + ""))
        $('#efectivoCuadratura').html(puntos("" + efectivoCuadratura + ""))
    })
}

function cerrarturno() {
    alertify.confirm('Cerrar Sesion', 'Está seguro que desea <span class="green-text"> Cerrar Sesion ?</span>', function() {
        db.ref(rutas.jornadas + rutas.jornadaActual + "/turnos/" + rutas.turnoactual).update({
            estado: false,
            horaCierre: obtenerHora()
        })
        volver()
    }, function() {});
}