var rutaDatosImportantesCuadratura = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/datosImportantes/";
function guardarCajaBase(monto) {
    var monto = monto.replace(".", "");
    var monto = monto.replace(".", "");
    var monto = monto.replace(".", "");
    var monto = monto.replace(".", "");
    if (rutas.turnoactual) {
        console.log('aqui222')
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
            cajaBasePorRecuperar=cajaBaseReferenciall-montoActual + monto
            db.ref(rutas.jornadas + rutas.jornadaActual + "/turnos/" + rutas.turnoactual + "/datosTurno/").update({
                cajabasetotal: montoActual + monto
            })
            cargarCajaBase()
        })
        $('#montoCajaBase').val('');
    } else {
        Materialize.toast('Para agregar caja base necesita tener un turno iniciado', 3000);
    }
}

function guardarRetiroCajaBase(monto) {
    var monto = monto.replace(".", "");
    var monto = monto.replace(".", "");
    var monto = monto.replace(".", "");
    var monto = monto.replace(".", "");
    if (rutas.turnoactual) {
        console.log('Registrando Retiro Caja Base');
        montoActual = 0;
        monto = parseInt(monto);
        db.ref(rutas.jornadas + rutas.jornadaActual + "/retirosCajaBase/").push({
            monto: monto,
            numeroturno: rutas.numeroturno,
            llaveturno: rutas.turnoactual
        })
        db.ref(rutas.jornadas + rutas.jornadaActual + "/turnos/" + rutas.turnoactual + "/datosTurno/").once('value', function(datTurnos) {
            montoActual = parseInt(datTurnos.val().retiroCajabasetotal);
        }).then(function(valor) {
            db.ref(rutas.jornadas + rutas.jornadaActual + "/turnos/" + rutas.turnoactual + "/datosTurno/").update({
                retiroCajabasetotal: montoActual + monto
            })
            cargarRetiroCajaBase()
        })
        $('#montoRetiroCajaBase').val('');
    } else {
        Materialize.toast('Para agregar caja base necesita tener un turno iniciado', 3000);
    }
}
function guardarEntregaCaja(monto) {
    console.log('guardar entrega')
    var monto = monto.replace(".", "");
    var monto = monto.replace(".", "");
    var monto = monto.replace(".", "");
    var monto = monto.replace(".", "");
    if (rutas.turnoactual) {
        montoActual = 0;
        monto = parseInt(monto);
        db.ref(rutas.jornadas + rutas.jornadaActual + "/entregaCaja/").push({
            monto: monto
        })
        db.ref(rutaDatosImportantesCuadratura).once('value', function(datTurnos) {
            montoActual = parseInt(datTurnos.val().montoEntregaDeCaja);
        }).then(function(valor) {
            db.ref(rutaDatosImportantesCuadratura).update({
                montoEntregaDeCaja: montoActual + monto
            })
        })
        cargarEntregaCaja();
    } else {
        Materialize.toast('Para agregar Entregar caja debe tener un turno iniciado', 3000);
    }
    cargarEntregaCaja();
    $('#montoEntregaCajaBase').val('');
}


function cargarRetiroCajaBase() {
    db.ref(rutas.jornadas + rutas.jornadaActual + "/retirosCajaBase/").orderByChild('estado').once('value', function(queryturnos) {
        contenidoRetiroCajaBase = ""
        montoRetiroCajaBaseJornada = 0;
        queryturnos.forEach(function(resultTurnos) {
            contenidoRetiroCajaBase += `
                    <tr>
                    <td style="width:33%;">` + resultTurnos.val().numeroturno + `</td>
<td style="width:33%;">` + puntuar(resultTurnos.val().monto) + `</td>
<td style="width:33%;" onclick='borrarRetiroCajaBase(` + resultTurnos.val().monto + `,"` + resultTurnos.key + `")'>Borrar</td>

                    </tr>

                    `
            montoRetiroCajaBaseJornada += parseInt(resultTurnos.val().monto)
        })
        db.ref(rutas.jornadas + rutas.jornadaActual + "/datosImportantes/").update({
            montoRetiroCajaBaseJornada: parseInt(montoRetiroCajaBaseJornada)
        })
        $('#tablaRetiroCajaBase').html(contenidoRetiroCajaBase)
    })
}

function cargarCajaBase() {
    db.ref(rutas.jornadas + rutas.jornadaActual + "/cajabase/").orderByChild('estado').once('value', function(queryturnos) {
        contenidoCajaBase = ""
        montoCajaBaseJornada = 0;
        queryturnos.forEach(function(resultTurnos) {
            contenidoCajaBase += `
                    <tr>
                    <td style="width:33%;">` + resultTurnos.val().numeroturno + `</td>
<td style="width:33%;">` + puntos(resultTurnos.val().monto) + `</td>
<td style="width:33%;" onclick='borrarCajaBase(` + resultTurnos.val().monto + `,"` + resultTurnos.key + `")'>Borrar</td>

                    </tr>

                    `
            montoCajaBaseJornada += parseInt(resultTurnos.val().monto)
        })
        db.ref(rutas.jornadas + rutas.jornadaActual + "/datosImportantes/").update({
            cajabase: parseInt(montoCajaBaseJornada)
        })
        $('#tablaCajaBase').html(contenidoCajaBase)
    })
}



function cargarEntregaCaja() {
    db.ref(rutas.jornadas + rutas.jornadaActual + "/entregaCaja/").once('value', function(datosEntrega) {
        contenidoTablaEntrega = ""
        datosEntrega.forEach(function(iEntrega) {
            console.log(iEntrega.val())
            contenidoTablaEntrega += `<tr>
<td class="grey lighten-2" style="width:50%;">` + puntuar(iEntrega.val().monto) + `</td>
<td style="width:50%;">   <span onclick="borrarEntregaCaja('` + iEntrega.key + `',`+ iEntrega.val().monto +`)">Borrar</span></td>
</tr>`
        })
        $('#tablaCajaBaseEntrega').html(contenidoTablaEntrega);
    })
}



function borrarEntregaCaja(llave,montoABorrar) {
    restoMontoActual = 0;
    db.ref(rutaDatosImportantesCuadratura).once('value', function(datTurnos) {
        montoActual = parseInt(datTurnos.val().montoEntregaDeCaja)
        montoFinal= montoActual - montoABorrar;
        db.ref(rutaDatosImportantesCuadratura).update({
            montoEntregaDeCaja: montoFinal
        })
        Materialize.toast('Entrega de Caja Eliminada', 3000);
        db.ref(rutas.jornadas + rutas.jornadaActual + "/entregaCaja/" + llave).remove();
    })
    cargarEntregaCaja();
}

function borrarRetiroCajaBase(monto, key) {
    montoActual = 0;
    alertify.confirm('eliminar Caja base', 'Está seguro en eliminar el Retiro de caja base?', function() {
        db.ref(rutas.jornadas + rutas.jornadaActual + "/turnos/" + rutas.turnoactual + "/datosTurno/").once('value', function(datTurnos) {
            montoActual = parseInt(datTurnos.val().retiroCajabasetotal);
        }).then(function(valor) {
            db.ref(rutas.jornadas + rutas.jornadaActual + "/turnos/" + rutas.turnoactual + "/datosTurno/").update({
                retiroCajabasetotal: montoActual - monto
            })
            db.ref(rutas.jornadas + rutas.jornadaActual + "/retirosCajaBase/" + key).remove();
            cargarRetiroCajaBase();
        })
        Materialize.toast('Retiro Caja base eliminado', 3000);
    }, function() {});
}
$(document).ready(function() {
    cargarRetiroCajaBase();
    $('ul.tabs').tabs();
});

function borrarCajaBase(monto, key) {
    montoActual = 0;
    alertify.confirm('eliminar Caja base', 'Está seguro en eliminar el monto de caja base?', function() {
        db.ref(rutas.jornadas + rutas.jornadaActual + "/turnos/" + rutas.turnoactual + "/datosTurno/").once('value', function(datTurnos) {
            montoActual = parseInt(datTurnos.val().cajabasetotal);
        }).then(function(valor) {
            db.ref(rutas.jornadas + rutas.jornadaActual + "/turnos/" + rutas.turnoactual + "/datosTurno/").update({
                cajabasetotal: montoActual - monto
            })
            db.ref(rutas.jornadas + rutas.jornadaActual + "/cajabase/" + key).remove();
            cargarCajaBase();
        })
        Materialize.toast('Caja base eliminada', 3000);
    }, function() {});
}
$(document).ready(function() {
    cargarCajaBase();
    cargarRetiroCajaBase();
    $('ul.tabs').tabs();
});