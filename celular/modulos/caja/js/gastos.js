rutaGastos = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/turnos/" + rutas.turnoactual + "/gastos/"
rutaGastosJornada = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/gastos/"
rutaDatosTurno = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/turnos/" + rutas.turnoactual + "/datosTurno/"
rutaDatosImportantesGastos = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/datosImportantes/"



function guardarGasto(monto, motivo,tipo) {

    var monto = monto.replace(".", "");
    var monto = monto.replace(".", "");
    var monto = monto.replace(".", "");
    var monto = monto.replace(",", "");
    var monto = monto.replace(",", "");
    var monto = monto.replace(",", "");
    if(parseInt(monto)<30000){
        db.ref("sistema/notificaciones/coyhaique/").push({
            fecha:obtenerFecha(),
            hora:obtenerHora(),
            detalle:"Se realizo un gasto de : $"+puntuar(monto)+" con el siguiente motiv o : "+motivo
        })
    }
    db.ref(rutaGastos).push({
        monto: monto,
        motivo: motivo,
        hora: obtenerHora(),
        tipo:tipo
    }).then(function(datoss) {
        db.ref(rutaGastosJornada + datoss.key).update({
            monto: monto,
            motivo: motivo,
            hora: obtenerHora(),
            tipo:tipo
        })

 
       

    })
  
    cargarGastos();
    sumarGastos(monto);
    $('#montoGasto').val('');
    $('#motivoGasto').val('');
}

function sumarGastos(gastoNuevo) {
    gastosActuales = 0;
    db.ref(rutaDatosImportantesGastos).once('value', function(datosGastos) {
        gastosActuales = parseInt(datosGastos.val().gastos) + parseInt(gastoNuevo)
        db.ref(rutaDatosImportantesGastos).update({
            gastos: gastosActuales
        })
    })
}

function restarGastos(gastoNuevo) {
    gastoNuevo = parseInt(gastoNuevo);
    gastosActuales = 0;
    db.ref(rutaDatosImportantesGastos).once('value', function(datosPremios) {
        if (datosPremios.val().gastos == undefined) {} else {
            gastosActuales = gastoNuevo;
            gastosActuales = parseInt(datosPremios.val().gastos) - parseInt(gastoNuevo)
        }
    }).then(function(datos) {
        db.ref(rutaDatosImportantesGastos).update({
            gastos: gastosActuales
        })
    })
}

function eliminarGasto(gasto, monto) {
    alertify.confirm('Eliminar Gasto', 'Está seguro que desea eliminar el Gasto?', function() {
        Materialize.toast('Gasto Eliminado', 3000);
        restarGastos(monto);
        cargarGastos();
        db.ref(rutaGastos + gasto).remove()
        db.ref(rutaGastosJornada + gasto).remove()
    }, function() {});
}

function cargarGastos() {
    db.ref(rutaGastos).once('value', function(datosGastos) {
        contenidoTablaGastos = ""
        montoTotalGastos = 0;
        contadorGastos = 0;
        datosGastos.forEach(function(iGastos) {
            contenidoTablaGastos += `<tr>
            <td  style="width: 25%;">` + puntos(iGastos.val().monto) + `</td>
            <td style="width: 25%;">` + iGastos.val().motivo + `</td>
            <td style="width: 25%;">` + iGastos.val().hora + `</td>
            <td style="width: 25%;">  <i class="material-icons"  onclick="eliminarGasto('` + iGastos.key + `','` + iGastos.val().monto + `')">delete</i></td>
            </tr>`
            contadorGastos += 1;
            montoTotalGastos += parseInt(iGastos.val().monto)
        })

        db.ref(rutaDatosTurno).update({
            gastosTotales: montoTotalGastos
        })
       
        $('#cuerpoGastos').html(contenidoTablaGastos);
        $('#gastosTotal').html(puntos(montoTotalGastos));
        $('#numeroTotalGastos').html(contadorGastos);
  

    })
}
          

function buscarGastos(motivoGastoBuscar) {
    if (motivoGastoBuscar == '') {
        cargarGastos();
    } else {
        db.ref(rutaGastos).orderByChild('motivo').startAt(motivoGastoBuscar).once('value', function(datosBuscarGastos) {
            contenidoTablaGastos2 = ""
            totalGastos = 0;
            datosBuscarGastos.forEach(function(hGasto) {
                contenidoTablaGastos2 += `<tr>
                <td  style="width: 25%;">` + puntos(hGasto.val().monto) + `</td>
                <td style="width: 25%;">` + hGasto.val().motivo + `</td>
                <td style="width: 25%;">` + hGasto.val().hora + `</td>
                <td style="width: 25%;">  <i class="material-icons"  onclick="eliminarGasto('` + hGasto.key + `','` + hGasto.val().monto + `')">delete</i></td>
                </tr>`
                totalGastos += parseInt(hGasto.val().monto)
            })
            $('#gastosTotal').html(puntos("" + totalGastos + ""))
            $('#tablaGastos').html(contenidoTablaGastos2);
        })
    }
}