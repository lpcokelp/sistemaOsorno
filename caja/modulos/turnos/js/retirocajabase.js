function guardarRetirosCajaBase(monto) {
    montoActual = 0;
    monto = parseInt(monto);
    db.ref(rutas.jornadas + rutas.jornadaActual + "/retirocajabase/").push({
        monto: monto,
        numeroturno: rutas.numeroturno,
        llaveturno: rutas.turnoactual
    })
    db.ref(rutas.jornadas + rutas.jornadaActual + "/turnos/" + rutas.turnoactual + "/datosTurno/").once('value', function(datTurnos) {
        montoActual = parseInt(datTurnos.val().retirocajabasetotal);
    }).then(function(valor) {
        db.ref(rutas.jornadas + rutas.jornadaActual + "/turnos/" + rutas.turnoactual + "/datosTurno/").update({
            retirocajabasetotal: montoActual + monto
        })
        cargarRetiroCajaBase()
    })
    $('#montoRetiroCajaBase').val('');
}

function cargarRetiroCajaBase() {
    db.ref(rutas.jornadas + rutas.jornadaActual + "/retirocajabase/").once('value', function(qRetiroCajaBase) {
        contenidoRetiroCajaBase = ""
        montoRetiroCajaBaseJornada = 0;
        qRetiroCajaBase.forEach(function(iRetiroCajaBase) {
            contenidoRetiroCajaBase += `
        <tr><td style='width:33%;'>` + iRetiroCajaBase.val().numeroturno + `</td>
        <td style='width:33%;'>` + iRetiroCajaBase.val().monto + `</td>
        <td style='width:33%;'>Borrar</td></tr>`
            montoRetiroCajaBaseJornada += parseInt(iRetiroCajaBase.val().monto)
        })
        db.ref(rutas.jornadas + rutas.jornadaActual + "/datosImportantes/").update({
            montoRetiroCajaBaseJornada: parseInt(montoRetiroCajaBaseJornada)
        })
        $('#tablaRetirosCajaBase').html(contenidoRetiroCajaBase)
    })
}
$(document).ready(function() {
    cargarRetiroCajaBase();
});