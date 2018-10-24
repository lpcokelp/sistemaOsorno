rutaRecaudaciones = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/turnos/" + rutas.turnoactual + "/recaudaciones/"
rutaRecaudacionesJornada = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/recaudaciones/"
rutaDatosTurno = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/turnos/" + rutas.turnoactual + "/datosTurno/"
rutaDatosImportantesRecaudaciones = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/datosImportantes/"
rutaDatosContadores = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/contadores/"
contadorRecaudacion = 0;

function guardarRecaudaciones(monto, maquina) {
    var monto = monto.replace(".", "");
    var monto = monto.replace(".", "");
    var monto = monto.replace(".", "");
    var monto = monto.replace(".", "");
    if(parseInt(monto)>90000){
        db.ref("sistema/notificaciones/coyhaique/").push({
            fecha:obtenerFecha(),
            hora:obtenerHora(),
            detalle:"Se recaudó : $"+puntuar(monto)+" de la maquina :"+maquina
        })
    }


    
    if (validarmaquina(maquina) == true) {
        db.ref(rutaRecaudaciones).push({
            monto: monto,
            maquina: maquina,
            hora: obtenerHora()
        }).then(function(datoss) {
            db.ref(rutaRecaudacionesJornada + datoss.key).update({
                monto: monto,
                maquina: maquina,
                hora: obtenerHora(),
            });
        });
        sumarRecaudacionesContador(monto, maquina)
        cargarRecaudaciones();
        sumarRecaudaciones(monto);
        $('#montoRecaudaciones').val('');
        $('#maquinaRecaudacion').val('');
    } else {
        Materialize.toast('Maquina no registrada', 3000);
    }
}

function sumarRecaudacionesContador(premionuevo, maquina) {
    premiosActuales = 0;
    db.ref(rutaDatosContadores).orderByChild('maquina').equalTo(maquina).once('value', function(datosPremiosContador) {
        premiosContador = 0;
        recaudacionesContador = 0;
        balanceContador = 0;
        control = 0;
        llaveContador = ""
        datosPremiosContador.forEach(function(datosPremios) {
            llaveContador = datosPremios.key;
            control = 1;
            if (datosPremios.val().premiosContador == undefined) {
                premiosContador = 0;
            } else {
                premiosContador = datosPremios.val().premiosContador;
            }
            if (datosPremios.val().recaudacionesContador == undefined) {
                recaudacionesContador = 0;
            } else {
                recaudacionesContador = parseInt(datosPremios.val().recaudacionesContador);
            }
            recaudacionesContador += parseInt(premionuevo);
        })
        balanceContador = recaudacionesContador - premiosContador;
        if (control == 1) {
            console.log("Sumando Recaudaciones")
            db.ref(rutaDatosContadores + llaveContador).update({
                maquina: maquina,
                premiosContador: premiosContador,
                recaudacionesContador: recaudacionesContador,
                balanceContador: balanceContador,
                hora:obtenerHora()
            })
        } else {
            console.log('opcion 2')
            db.ref(rutaDatosContadores).push({
                maquina: maquina,
                premiosContador: premiosContador,
                recaudacionesContador: recaudacionesContador,
                balanceContador: balanceContador,
                hora:obtenerHora()
            })
        }
    })
}

function restarRecaudacionesContador(premionuevo, maquina) {
    premiosActuales = 0;
    db.ref(rutaDatosContadores).orderByChild('maquina').equalTo(maquina).once('value', function(datosPremiosContador) {
        premiosContador = 0;
        recaudacionesContador = 0;
        balanceContador = 0;
        control = 0;
        llaveContador = ""
        datosPremiosContador.forEach(function(datosPremios) {
            control = 1;
            llaveContador = datosPremios.key;
            if (datosPremios.val().premiosContador == undefined) {
                premiosContador = 0;
            } else {
                premiosContador = datosPremios.val().premiosContador;
            }
            premiosContador -= premionuevo;
            if (datosPremios.val().recaudacionesContador == undefined) {
                recaudacionesContador = 0;
            } else {
                recaudacionesContador = parseInt(datosPremios.val().recaudacionesContador);
            }
        })
        balanceContador = recaudacionesContador - premiosContador;
        if (control == 1) {
            console.log("opcion 1")
            db.ref(rutaDatosContadores + llaveContador).update({
                maquina: maquina,
                premiosContador: premiosContador,
                recaudacionesContador: recaudacionesContador,
                balanceContador: balanceContador
            })
        } else {
            console.log('opcion 2')
            db.ref(rutaDatosContadores).push({
                maquina: maquina,
                premiosContador: premiosContador,
                recaudacionesContador: recaudacionesContador,
                balanceContador: balanceContador
            })
        }
    })
}

function sumarRecaudaciones(recaudacionnueva) {
    recaudacionesActuales = 0;
    db.ref(rutaDatosImportantesRecaudaciones).once('value', function(datosPremios) {
        if (datosPremios.val().premios == undefined) {
            recaudacionesActuales = recaudacionnueva;
        } else {
            console.log('si existe')
            recaudacionesActuales = parseInt(datosPremios.val().recaudaciones) + parseInt(recaudacionnueva)
        }
    }).then(function(datos) {
        db.ref(rutaDatosImportantesRecaudaciones).update({
            recaudaciones: recaudacionesActuales
        })
    })
}

function restarRecaudaciones(recaudacionnueva) {
    recaudacionnueva = parseInt(recaudacionnueva);
    recaudacionesActuales = 0;
    db.ref(rutaDatosImportantesRecaudaciones).once('value', function(datosPremios) {
        if (datosPremios.val().recaudaciones == undefined) {
            recaudacionesActuales = recaudacionnueva;
        } else {
            console.log('si existe')
            recaudacionesActuales = parseInt(datosPremios.val().recaudaciones) + parseInt(recaudacionnueva)
        }
    }).then(function(datos) {
        db.ref(rutaDatosImportantesRecaudaciones).update({
            recaudaciones: recaudacionesActuales
        })
    })
}

function eliminarRecaudacion(recaudacion, monto, maquina) {
    alertify.confirm('Eliminar Premio', 'Está seguro que desea eliminar la recaudación?', function() {
        Materialize.toast('Recaudacion Eliminada', 3000);
        restarPremios(monto);
        cargarRecaudaciones();
        restarRecaudacionesContador(monto, maquina)
        db.ref(rutaRecaudaciones + recaudacion).remove()
        db.ref(rutaRecaudacionesJornada + recaudacion).remove()
    }, function() {});
}

function cargarRecaudaciones() {
    arregloMaquinaRecaudaciones = [];
    arregloContadorRecaudaciones = [];
    arregloMontoRecaudaciones = [];
    arregloHoraRecaudaciones = [];
    arregloKeyRecaudaciones = [];
    db.ref(rutaRecaudaciones).once('value', function(datosRecaudaciones) {
        contenidoTablaRecaudaciones = ""
        montoTotalRecaudaciones = 0;
        contadorRecaudacion = 0;
        datosRecaudaciones.forEach(function(iRecaudaciones) {
            arregloMaquinaRecaudaciones.push(iRecaudaciones.val().maquina);
            arregloContadorRecaudaciones.push(iRecaudaciones.val().contador);
            arregloMontoRecaudaciones.push(iRecaudaciones.val().monto);
            arregloHoraRecaudaciones.push(iRecaudaciones.val().hora);
            arregloKeyRecaudaciones.push(iRecaudaciones.key);
            contadorRecaudacion += 1;
            montoTotalRecaudaciones += parseInt(iRecaudaciones.val().monto)
        })
        for (var i = arregloKeyRecaudaciones.length - 1; i > -1; i--) {
            contenidoTablaRecaudaciones += `<tr>
<td  style="width: 25%;">` + arregloMaquinaRecaudaciones[i] + `</td>
<td style="width: 25%;">` + puntos(arregloMontoRecaudaciones[i]) + `</td>
<td style="width: 25%;">` + arregloHoraRecaudaciones[i] + `</td>
<td style="width: 25%;">  <i class="material-icons"  onclick="eliminarRecaudacion('` + arregloKeyRecaudaciones[i] + `','` + arregloMontoRecaudaciones[i] + `','` + arregloMaquinaRecaudaciones[i] + `')">delete</i></td>
</tr>`
        }
        db.ref(rutaDatosTurno).update({
            recaudacionesTotales: montoTotalRecaudaciones
        })
        $('#tablaRecaudaciones').html(contenidoTablaRecaudaciones);
        $('#recaudacionTotal').html(puntos("" + montoTotalRecaudaciones + ""));
        $('#numeroTotalRecaudaciones').html(contadorRecaudacion);
    })
}

function buscarRecaudacionMaquina(numeroMaquinaRecaudacion) {
    if (numeroMaquinaRecaudacion == '') {
        cargarRecaudaciones();
    } else {
        db.ref(rutaRecaudaciones).orderByChild('maquina').equalTo(numeroMaquinaRecaudacion).once('value', function(datosRecaudacionMaquina) {
            contenidoTablaRecaudacion2 = ""
            totMaquinaRecaudacion = 0;
            datosRecaudacionMaquina.forEach(function(rMaquina) {
                contenidoTablaRecaudacion2 += `<tr>
<td  style="width: 25%;">` + rMaquina.val().maquina + `</td>
<td style="width: 25%;">` + puntos(rMaquina.val().monto) + `</td>
<td style="width: 25%;">` + rMaquina.val().hora + `</td>
<td style="width: 25%;">  <i class="material-icons"  onclick="eliminarPremio('` + rMaquina.key + `','` + rMaquina.val().monto + `','` + rMaquina.val().maquina + `')">delete</i></td>
</tr>`
                totMaquinaRecaudacion += parseInt(rMaquina.val().monto)
            })
            console.log(totMaquinaRecaudacion);
            $('#recaudacionTotal').html(puntos("" + totMaquinaRecaudacion + ""))
            $('#tablaRecaudaciones').html(contenidoTablaRecaudacion2);
        })
    }
}