rutaPremios = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/turnos/" + rutas.turnoactual + "/premios/"
rutaPremiosJornada = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/premios/"
rutaDatosImportantesPremios = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/datosImportantes/";
contadorPremios = 0;

function guardarPremios(monto, maquina) {
    //Se eliminan los puntos
    monto = eliminarPuntos(monto);
  
    if (validarmaquina(maquina) == true) {
        db.ref(rutaPremios).push({
            monto: monto,
            maquina: maquina,
            hora: obtenerHora(),
            contador: contadorPremios + 1
        }).then(function (datoss) {
            db.ref(rutaPremiosJornada + datoss.key).update({
                monto: monto,
                hora: obtenerHora(),
                maquina:parseInt(maquina)

            });
            cargarpremios();
            
        });
        sumarPremios(monto);
        sumarPremiosContador(monto, maquina);
        $('#montopremio').val('').focus();
        $('#maquinapremio').val('').blur();
    } else {
        Materialize.toast('Maquina no registrada', 3000);
    }
    actualizarValorContadores(maquina)
}

function sumarPremios(premionuevo) {
    premiosActuales = 0;
    db.ref(rutaDatosImportantesPremios).once('value', function (datosPremios) {
        if (datosPremios.val().premios == undefined) {
            premiosActuales = premionuevo;
        } else {
            premiosActuales = parseInt(datosPremios.val().premios) + parseInt(premionuevo)
        }
    }).then(function (datos) {
        db.ref(rutaDatosImportantesPremios).update({
            premios: premiosActuales
        })
    })
}

function sumarPremiosContador(premionuevo, maquina) {
    premiosActuales = 0;
    db.ref(rutaDatosContadores).orderByChild('maquina').equalTo(parseInt(maquina)).once('value', function (datosPremiosContador) {
        premiosContador = 0;
        recaudacionesContador = 0;
        balanceContador = 0;
        control = 0
        llaveMaquina = ""
        datosPremiosContador.forEach(function (datosPremios) {
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
                premiosContador: premiosContador,
                recaudacionesContador: recaudacionesContador,
                balanceContador: balanceContador
            })
        } else {
            console.log("No Existe un registro de la maquina" + maquina)
         
        }
    })
}

function restarPremiosContador(premionuevo, maquina) {
   
    premiosActuales = 0;
    db.ref(rutaDatosContadores).orderByChild('maquina').equalTo(parseInt(maquina)).once('value', function (datosPremiosContador) {
        premiosContador = 0;
        recaudacionesContador = 0;
        balanceContador = 0;
        control = 0;
        llaveContador = ""
        datosPremiosContador.forEach(function (datosPremios) {
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
                premiosContador: premiosContador,
                recaudacionesContador: recaudacionesContador,
                balanceContador: balanceContador
            })
         
        } else {
            console.log('Restando Premios')
            db.ref(rutaDatosContadores).push({
           
                premiosContador: premiosContador,
                recaudacionesContador: recaudacionesContador,
                balanceContador: balanceContador
            })
        }
    })
    actualizarValorContadores(maquina)
}

function restarPremios(premionuevo) {
    premionuevo = parseInt(premionuevo);
    premiosActuales = 0;
    db.ref(rutaDatosImportantesPremios).once('value', function (datosPremios) {
        if (datosPremios.val().premios == undefined) {
            premiosActuales = premionuevo;
        } else {
            premiosActuales = parseInt(datosPremios.val().premios) - parseInt(premionuevo)
        }
    }).then(function (datos) {
        db.ref(rutaDatosImportantesPremios).update({
            premios: premiosActuales
        })
    })
}

function eliminarPremio(premio, monto, maquina) {
    swal({
        title: 'Está seguro?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si!'
    }).then((result) => {
        if (result.value) {
            Materialize.toast('Premio Eliminado', 3000);
            restarPremios(monto);
            $('#' + premio).remove();
            restarPremiosContador(monto, maquina)
            db.ref(rutaPremios + premio).remove()
            $("#"+premio).remove();
            db.ref(rutaPremiosJornada + premio).remove()
         
        }
    })
}

function cargarpremios() {
    console.log("Hola");
    $('#buscadorPremio').val('');
    contenidoTablaPremios="";
    arregloMaquinaPremios = [];
    arregloContadorPremios = [];
    arregloMontoPremios = [];
    arregloHoraPremios = [];
    arregloKeyPremios = [];
    db.ref(rutaPremios).orderByChild('contador').once('value', function (datosPremios) {
        contenidoTablaPremios = ""
        montoTotalPremios = 0;
        contadorPremios = 0;
        datosPremios.forEach(function (ipremios) {
            arregloMaquinaPremios.push(ipremios.val().maquina);
            arregloContadorPremios.push(ipremios.val().contador);
            arregloMontoPremios.push(ipremios.val().monto);
            arregloHoraPremios.push(ipremios.val().hora);
            arregloKeyPremios.push(ipremios.key);
            contadorPremios += 1;
            montoTotalPremios += parseInt(ipremios.val().monto)
        })


            for (var i = arregloKeyPremios.length - 1; i > -1; i--) {
                contenidoTablaPremios += `<tr  style="font-size:130%;" id="` + arregloKeyPremios[i] + `">
                <td class="encabezadoTablaPremios blue-text" style="font-size:130%;"    >` + arregloMaquinaPremios[i] + `</td>
                <td class="encabezadoTablaPremios">` + puntos(arregloMontoPremios[i]) + `</td>
                <td class="encabezadoTablaPremios">` + arregloHoraPremios[i] + `</td>
                <td class="encabezadoTablaPremios">  <i class="material-icons "  onclick="eliminarPremio('` + arregloKeyPremios[i] + `','` + arregloMontoPremios[i] + `','` + arregloMaquinaPremios[i] + `')">delete</i></td>
                </tr>`
            }
        
   
        db.ref(rutaDatosTurno).update({
            premiosTotales: montoTotalPremios
        })
        $('#cantidadPremios').html(contadorPremios);

        $('#premiosTotalPremios').html(puntos("" + montoTotalPremios + ""))
        $('#cuerpoPremios').html(contenidoTablaPremios);

    
    })
}


function validarVacioPrem() {
    console.log("si");
   contenido=$('#buscadorPremio').val();
    if(contenido==''){
        cargarpremios()
    }

}
function buscarNumeroMaquinaPrem(numeroMaquina) {
    db.ref(rutaPremios).off();

    contadorPremios = 0;
    if (numeroMaquina == '') {
        cargarpremios();
    } else {
        db.ref(rutaPremios).orderByChild('maquina').equalTo(numeroMaquina).once('value', function (datosRecaudacionMaquina) {
            contenidoTablaPremios2 = ""
            totMaquina = 0;
            datosRecaudacionMaquina.forEach(function (nMaquina) {
                contenidoTablaPremios2 += `<tr  style="font-size:130%;" id="` + nMaquina.key + `" >
<td  class="encabezadoTablaPremios blue-text" style="font-size:130%;" >` + nMaquina.val().maquina + `</td>
<td class="encabezadoTablaPremios">` + puntos(nMaquina.val().monto) + `</td>
<td class="encabezadoTablaPremios">` + nMaquina.val().hora + `</td>
<td class="encabezadoTablaPremios">  <i class="material-icons"  onclick="eliminarPremio('` + nMaquina.key + `','` + nMaquina.val().monto + `','` + nMaquina.val().maquina + `')">delete</i></td>
</tr>`
                totMaquina += parseInt(nMaquina.val().monto)
                contadorPremios += 1;
            })
            $('#cantidadPremios').html(contadorPremios);
            $('#premiosTotalPremios').html(puntos("" + totMaquina + ""))
            $('#cuerpoPremios').html(contenidoTablaPremios2);
        })
    }


   
}