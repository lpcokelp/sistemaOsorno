function guardarCajaBase(monto) {
    montoActual = 0;
    monto = parseInt(monto);
    db.ref(rutas.jornadas + rutas.jornadaActual + "/cajabase/").push({
        monto: monto,
        numeroturno: rutas.numeroturno,
        llaveturno: rutas.turnoactual
    })
    db.ref(rutas.jornadas + rutas.jornadaActual + "/turnos/" + rutas.turnoactual + "/datosTurno/").once('value', function(datTurnos) {
        montoActual = parseInt(datTurnos.val().cajabasetotal);
    }).then(function(valor) {
        db.ref(rutas.jornadas + rutas.jornadaActual + "/turnos/" + rutas.turnoactual + "/datosTurno/").update({
            cajabasetotal: montoActual + monto
        })
        cargarCajaBase()
    })
    $('#montoCajaBase').val('');
}

function cargarCajaBase() {
    db.ref(rutas.jornadas + rutas.jornadaActual + "/cajabase/").orderByChild('estado').once('value', function(queryturnos) {
        contenidoCajaBase = ""
        montoCajaBaseJornada = 0;
        queryturnos.forEach(function(resultTurnos) {
            contenidoCajaBase += `
                    <tr>
                    <td>` + resultTurnos.val().numeroturno + `</td>
<td>` + puntos(resultTurnos.val().monto) + `</td>
<td>Borrar</td>

                    </tr>

                    `
            montoCajaBaseJornada += parseInt(resultTurnos.val().monto)
        })
        db.ref(rutas.jornadas + rutas.jornadaActual + "/datosImportantes/").update({
            montoCajaBaseJornada: parseInt(montoCajaBaseJornada)
        })
        $('#tablaCajaBase').html(contenidoCajaBase)
    })
}
$(document).ready(function() {
    cargarCajaBase();
});