rutapremios = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/turnos/" + rutas.turnoactual + "/premios/"
rutaPremiosJornada = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/premios/"
rutaDatosTurno = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/turnos/" + rutas.turnoactual + "/datosTurno/"
rutaDatosImportantesPremios = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/datosImportantes/";
rutaDatosContadores = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/contadores/"
contadorPremios = 0;

function guardarpremios(monto, maquina) {
 
    var monto = monto.replace(".", "");
    var monto = monto.replace(".", "");
    var monto = monto.replace(".", "");
    var monto = monto.replace(".", "");
    if(parseInt(monto)>120000){
        db.ref("sistema/notificaciones/coyhaique/").push({
            fecha:obtenerFecha(),
            hora:obtenerHora(),
            detalle:"Se pagó un Premio de : $"+puntuar(monto) + " en la maquina : " +maquina
        })
    } 
    if (validarmaquina(maquina) == true) {
        db.ref(rutapremios).push({
            monto: monto,
            maquina: maquina,
            hora: obtenerHora(),
            contador: contadorPremios + 1
        }).then(function(datoss) {
            db.ref(rutaPremiosJornada + datoss.key).update({
                monto: monto,
                maquina: maquina,
                hora: obtenerHora()
            });
        });
        cargarpremios();
        sumarPremios(monto);
        sumarPremiosContador(monto, maquina);
        $('#montopremio').val('');
        $('#maquinapremio').val('');
    } else {
        Materialize.toast('Maquina no registrada', 3000);
    }
}

function sumarPremios(premionuevo) {
    premiosActuales = 0;
    db.ref(rutaDatosImportantesPremios).once('value', function(datosPremios) {
        if (datosPremios.val().premios == undefined) {
            premiosActuales = premionuevo;
        } else {
            premiosActuales = parseInt(datosPremios.val().premios) + parseInt(premionuevo)
        }
    }).then(function(datos) {
        db.ref(rutaDatosImportantesPremios).update({
            premios: premiosActuales
        })
    })
}

function sumarPremiosContador(premionuevo, maquina) {
    premiosActuales = 0;
    db.ref(rutaDatosContadores).orderByChild('maquina').equalTo(maquina).once('value', function(datosPremiosContador) {
        premiosContador = 0;
        recaudacionesContador = 0;
        balanceContador = 0;
        control = 0
        llaveMaquina = ""
        datosPremiosContador.forEach(function(datosPremios) {
            control = 1;
            llaveMaquina = datosPremios.key;
            if (datosPremios.val().premiosContador == undefined) {
                premiosContador = 0;
            } else {
                premiosContador = parseInt(datosPremios.val().premiosContador);
            }
            
            premiosContador += parseInt(premionuevo);
            if (datosPremios.val().recaudacionesContador == undefined) {
                recaudacionesContador = 0;
            } else {
                recaudacionesContador = parseInt(datosPremios.val().recaudacionesContador);
            }
        })




        balanceContador = recaudacionesContador - premiosContador;

        if (control == 1) {
            console.log("Existe un registro de la maquina" + maquina)
            db.ref(rutaDatosContadores + llaveMaquina).update({
                maquina: maquina,
                premiosContador: premiosContador,
                recaudacionesContador: recaudacionesContador,
                balanceContador: balanceContador
            })
        } else {
            console.log("No Existe un registro de la maquina" + maquina)
            db.ref(rutaDatosContadores).push({
                maquina: maquina,
                premiosContador: premiosContador,
                recaudacionesContador: recaudacionesContador,
                balanceContador: balanceContador
            })
        }
    })
}

function restarPremiosContador(premionuevo, maquina) {
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
                premiosContador = parseInt(datosPremios.val().premiosContador);
            }
            premiosContador -= parseInt(premionuevo);
            if (datosPremios.val().recaudacionesContador == undefined) {
                recaudacionesContador = 0;
            } else {
                recaudacionesContador = parseInt(datosPremios.val().recaudacionesContador);
            }
        })
        balanceContador = recaudacionesContador - premiosContador;
        if (control == 1) {
            console.log("Restando Premio")
            db.ref(rutaDatosContadores + llaveContador).update({
                maquina: maquina,
                premiosContador: premiosContador,
                recaudacionesContador: recaudacionesContador,
                balanceContador: balanceContador
            })
        } else {
            console.log('Restando Premios')
            db.ref(rutaDatosContadores).push({
                maquina: maquina,
                premiosContador: premiosContador,
                recaudacionesContador: recaudacionesContador,
                balanceContador: balanceContador
            })
        }
    })
}

function restarPremios(premionuevo) {
    premionuevo = parseInt(premionuevo);
    premiosActuales = 0;
    db.ref(rutaDatosImportantesPremios).once('value', function(datosPremios) {
        if (datosPremios.val().premios == undefined) {
            premiosActuales = premionuevo;
        } else {
            premiosActuales = parseInt(datosPremios.val().premios) - parseInt(premionuevo)
        }
    }).then(function(datos) {
        db.ref(rutaDatosImportantesPremios).update({
            premios: premiosActuales
        })
    })
}

function eliminarPremio(premio, monto, maquina) {
    alertify.confirm('Eliminar Premio', 'Está seguro que desea eliminar el premio?', function() {
        Materialize.toast('Premio Eliminado', 3000);
        restarPremios(monto);
        cargarpremios();
        restarPremiosContador(monto, maquina)
        db.ref(rutapremios + premio).remove()
        db.ref(rutaPremiosJornada + premio).remove()
    }, function() {});
}

function cargarpremios() {
    arregloMaquinaPremios = [];
    arregloContadorPremios = [];
    arregloMontoPremios = [];
    arregloHoraPremios = [];
    arregloKeyPremios = [];
    db.ref(rutapremios).orderByChild('contador').once('value', function(datosPremios) {
        contenidoTablaPremios = ""
        montoTotalPremios = 0;
        contadorPremios = 0;
        datosPremios.forEach(function(ipremios) {
            arregloMaquinaPremios.push(ipremios.val().maquina);
            arregloContadorPremios.push(ipremios.val().contador);
            arregloMontoPremios.push(ipremios.val().monto);
            arregloHoraPremios.push(ipremios.val().hora);
            arregloKeyPremios.push(ipremios.key);
            contadorPremios += 1;
            montoTotalPremios += parseInt(ipremios.val().monto)
        })
        for (var i = arregloKeyPremios.length - 1; i > -1; i--) {
            contenidoTablaPremios += `<tr>
<td  style="width: 25%;">` + arregloMaquinaPremios[i] + `</td>
<td style="width: 25%;">` + puntos(arregloMontoPremios[i]) + `</td>
<td style="width: 25%;">` + arregloHoraPremios[i] + `</td>
<td style="width: 25%;">  <i class="material-icons"  onclick="eliminarPremio('` + arregloKeyPremios[i] + `','` + arregloMontoPremios[i] + `','` + arregloMaquinaPremios[i] + `')">delete</i></td>
</tr>`
        }
        db.ref(rutaDatosTurno).update({
            premiosTotales: montoTotalPremios
        })
        $('#premiosTotal').html(contadorPremios);
        $('#premiosTotalPremios').html(puntos("" + montoTotalPremios + ""))
        $('#tablapremios').html(contenidoTablaPremios);
    })
}

function buscarNumeroMaquina(numeroMaquina) {
    contadorPremios = 0;
    if (numeroMaquina == '') {
        cargarpremios();
    } else {
        db.ref(rutapremios).orderByChild('maquina').equalTo(numeroMaquina).once('value', function(datosRecaudacionMaquina) {
            contenidoTablaPremios2 = ""
            totMaquina = 0;
            datosRecaudacionMaquina.forEach(function(nMaquina) {
                contenidoTablaPremios2 += `<tr>
<td  style="width: 25%;">` + nMaquina.val().maquina + `</td>
<td style="width: 25%;">` + puntos(nMaquina.val().monto) + `</td>
<td style="width: 25%;">` + nMaquina.val().hora + `</td>
<td style="width: 25%;">  <i class="material-icons"  onclick="eliminarPremio('` + nMaquina.key + `','` + nMaquina.val().monto + `','` + nMaquina.val().maquina + `')">delete</i></td>
</tr>`
                totMaquina += parseInt(nMaquina.val().monto)
                contadorPremios += 1;
            })
            $('#premiosTotal').html(contadorPremios);
            $('#premiosTotalPremios').html(puntos("" + totMaquina + ""))
            $('#tablapremios').html(contenidoTablaPremios2);
        })
    }
}