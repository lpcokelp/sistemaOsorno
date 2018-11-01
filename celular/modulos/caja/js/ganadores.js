rutaGastos = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/turnos/" + rutas.turnoactual + "/gastos/"
rutaDatosTurno = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/turnos/" + rutas.turnoactual + "/datosTurno/"
rutaDatosImportantesGastos = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/datosImportantes/"
rutaGanadoresJackpot = "sistema/ganadores/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/"

function guardarGastoGanador(llave, monto, nombre) {
    console.log('guardando')
    db.ref(rutaGastos).push({
        monto: monto,
        motivo: 'Jackpot' + nombre,
        hora: obtenerHora()
    });
    db.ref(rutaGanadoresJackpot + llave).update({
        estado: 'pagado'
    })
    cargarGanadores();
    sumarGastosGanador(monto);
}

function sumarGastosGanador(gastoNuevo) {
    gastosActuales = 0;
    db.ref(rutaDatosImportantesGastos).once('value', function(datosGastosGanadores) {
        gastosActuales = parseInt(datosGastosGanadores.val().gastos) + parseInt(gastoNuevo)
        db.ref(rutaDatosImportantesGastos).update({
            gastos: gastosActuales
        })
    })
}

function cargarGanadores() {
    db.ref(rutaGanadoresJackpot).once('value', function(datosGastosGanadores) {
        contenidoTablaGastos = ""
        montoTotalGastos = 0;
        contadorGastos = 0;
        datosGastosGanadores.forEach(function(iGastosGanadores) {
            console.log(iGastosGanadores.val())
            if (iGastosGanadores.val().estado == 'revision') {
                botonGanador = `<button class='btn' onclick="guardarGastoGanador('` + iGastosGanadores.key + `',` + parseInt(iGastosGanadores.val().premio) + `,'` + iGastosGanadores.val().nombreCliente + ` ')">Pagar</button>`
            } else {
                botonGanador = ``
            }
            contenidoTablaGastos += `<tr>
            <td  style="width: 25%;">` + iGastosGanadores.val().nombreCliente + `</td>
            <td style="width: 25%;">` + iGastosGanadores.val().rutCliente + `</td>
            <td style="width: 25%;">` + puntuar(iGastosGanadores.val().premio) + `</td>
            <td style="width: 25%;"> ` + botonGanador + `</td>
            </tr>`
            contadorGastos += 1;
        })
        $('#cuerpoGanadores').html(contenidoTablaGastos);
    })
}