rutapremios = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/turnos/" + rutas.turnoactual + "/premios/"
rutaDatosTurno = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/turnos/" + rutas.turnoactual + "/datosTurno/"
rutaDatosImportantesCuadratura = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/datosImportantes/";
rutaDatosContadores = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/contadores/"
contadorPremios = 0;

function registrarContador(maquina, entrada, salida) {
    var entrada = entrada.replace(".", "");
    var entrada = entrada.replace(".", "");
    var entrada = entrada.replace(".", "");
    var salida = salida.replace(".", "");
    var salida = salida.replace(".", "");
    var salida = salida.replace(".", "");
    InAyerTemporal = 0;
    OutAyerTemporal = 0;
    multiplicadorMaquina = 0;
    //consultamos si existe la maaquina
    if (validarmaquina(maquina) == true) {
        db.ref('sistema/maquinas/' + sessionStorage.localcredencial).orderByChild('numMaquina').equalTo(maquina).once('value', function(datmaq) {
            controlMaquina = 0;
            datmaq.forEach(function(itemMaq) {
                InAyerTemporal = parseInt(itemMaq.val().inMaquina);
                OutAyerTemporal = parseInt(itemMaq.val().outMaquina);
                multiplicadorMaquina = parseInt(itemMaq.val().multiMaquina);
                if (parseInt(entrada) >= parseInt(itemMaq.val().inMaquina)) {
                    controlMaquina = 0
                } else {
                    controlMaquina = 1
                }
                if (parseInt(salida) >= parseInt(itemMaq.val().outMaquina)) {
                    controlMaquina = 0
                } else {
                    controlMaquina = 1
                }
            })
            //consultamos si es que los valores son iguales o mayores que ayer
            if (controlMaquina == 0) {
                db.ref(rutaDatosContadores).orderByChild('maquina').equalTo(maquina).once('value', function(datosPremiosContador) {
                    diferenciaOut = 0;
                    diferenciaIn = 0;
                    inAnterior = 0;
                    outAnterior = 0;
                    inHoy = 0;
                    outHoy = 0;
                    balance = 0;
                    llaveContador = ""
                    datosPremiosContador.forEach(function(datosPremios) {
                        llaveContador = datosPremios.key;
                        diferenciaOut = parseInt(datosPremios.val().premiosContador);
                        diferenciaIn = parseInt(datosPremios.val().recaudacionesContador);
                        inAnterior = parseInt(InAyerTemporal);
                        outAnterior = parseInt(OutAyerTemporal);
                        inHoy = parseInt(entrada);
                        outHoy = parseInt(salida);
                        entrada = (inHoy - inAnterior)
                        salida = (outHoy - outAnterior)
                        diferenciaOut = (diferenciaOut) - (salida * multiplicadorMaquina);
                        diferenciaIn = (diferenciaIn) - (entrada * multiplicadorMaquina);
                        balanceContador = entrada - salida;
                        balance = (entrada - salida) * multiplicadorMaquina;
                    })
                    db.ref(rutaDatosContadores + llaveContador).update({
                        multiplicadorMaquina: multiplicadorMaquina,
                        diferenciaOut: diferenciaOut,
                        diferenciaIn: diferenciaIn,
                        inAnterior: inAnterior,
                        outAnterior: outAnterior,
                        inHoy: inHoy,
                        outHoy: outHoy,
                        entrada: entrada,
                        salida: salida,
                        balance: balance,
                        balanceContador: balanceContador
                    })
                    cuerpoTablaModalInferior = `
<tr>
<td> ` + maquina + `</td>
<td> $` + puntuar(entrada * multiplicadorMaquina) + `</td>
<td> $` + puntuar(salida * multiplicadorMaquina) + `</td>
<td> $` + puntuar(balance) + `</td>
</tr>
`;
                    $('#cuerpoTablaModalInferior').html(cuerpoTablaModalInferior);
                    $('#modalInferior').modal('open')
                })
                $('#montopremio').val('');
                $('#maquinapremio').val('');
                $('#maquinaContador').val('').blur();
                $('#inContador').val('').blur();
                $('#outContador').val('').blur();
            } else {
                Materialize.toast('El contador actual debe ser igual o mayor quel el anterior', 4000);
                Materialize.toast('In Anterior' + InAyerTemporal, 3000);
                Materialize.toast('OUT Anterior' + OutAyerTemporal, 3000);
                $('#inContador').val('').blur();
                $('#outContador').val('').blur();
            }
        })
    } else {
        $('#maquinaContador').val('').blur();
        Materialize.toast('Maquina no registrada', 3000);
    }
}

function guardarEntregaCaja(monto) {
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
}

function borrarEntregaCaja(llave) {
    montoActual = 0;
    Materialize.toast('Entrega de Caja Eliminada', 3000);
    restoMontoActual = 0;
    db.ref(rutas.jornadas + rutas.jornadaActual + "/entregaCaja/" + llave).once('value', function(datTurnos) {
        restoMontoActual = parseInt(datTurnos.val().monto)
        db.ref(rutaDatosImportantesCuadratura).once('value', function(datTurnos) {
            montoActual = parseInt(datTurnos.val().montoEntregaDeCaja);
        })
        montoFinal = -montoActual - restoMontoActual;
        db.ref(rutaDatosImportantesCuadratura).update({
            montoEntregaDeCaja: montoFinal
        })
        Materialize.toast('Entrega de Caja Eliminada', 3000);
        db.ref(rutas.jornadas + rutas.jornadaActual + "/entregaCaja/" + llave).remove();
    })
    cargarEntregaCaja();
}

function cargarCierre() {
    gastosTotales = 0;
    cajabase = 0;
    premiostotales = 0;
    recaudacionesTotales = 0;
    premiosActuales = 0;
    gananciaContadores = 0;
    montoEntregaDeCaja = 0;
    db.ref(rutaDatosContadores).once('value', function(datosPremios) {
        sumaBalance = 0;
        datosPremios.forEach(function(ipremios) {
            sumaBalance += parseInt(ipremios.val().balance)
        })
    })
    db.ref(rutaDatosImportantesCuadratura).once('value', function(iCuadratura) {
        gastosTotales = parseInt(iCuadratura.val().gastos);
        cajabase = parseInt(iCuadratura.val().montoCajaBaseJornada);
        premiosTotales = parseInt(iCuadratura.val().premios);
        recaudacionesTotales = parseInt(iCuadratura.val().recaudaciones);
        montoEntregaDeCaja = parseInt(iCuadratura.val().montoEntregaDeCaja);
        montoRetiroEntregaDeCaja = parseInt(iCuadratura.val().montoRetiroCajaBaseJornada);
        gananciaContadores = sumaBalance - gastosTotales;
        if (gananciaContadores < 0) {
            gananciaContadores = 0;
        }
        CuadraturaBalance = cajabase + sumaBalance - gastosTotales - montoRetiroEntregaDeCaja
        if (CuadraturaBalance < 0) {
            clasecolor = "<span class='red-text'>$" + CuadraturaBalance + " </span>"
        } else {
            clasecolor = "<span>$" + CuadraturaBalance + " </span>"
        }
        diferencia = montoEntregaDeCaja - CuadraturaBalance
        $('#CuadraturaEntregaCaja').html("$" + puntuar(montoEntregaDeCaja));
        $('#CuadraturaRetiroCajaBase').html("$" + puntuar(montoRetiroEntregaDeCaja));
        $('#CuadraturaDiferencia').html("$" + puntuar(diferencia))
        $('#CuadraturaCajaBase').html("$" + puntuar(cajabase));
        $('#CuadraturaBalance').html(clasecolor);
        $('#CuadraturaContadores').html("$" + puntuar(sumaBalance));
        $('#CuadraturaGastos').html("$" + puntuar(gastosTotales));
        $('#CuadraturaGanancia').html("$" + puntuar(gananciaContadores));
    })
}

function cargarEntregaCaja() {
    db.ref(rutas.jornadas + rutas.jornadaActual + "/entregaCaja/").once('value', function(datosEntrega) {
        contenidoTablaEntrega = ""
        datosEntrega.forEach(function(iEntrega) {
            console.log(iEntrega.val())
            contenidoTablaEntrega += `<tr>
<td class="grey lighten-2" style="width:50%;">` + puntuar(iEntrega.val().monto) + `</td>
<td style="width:50%;">   <i class=" material-icons" onclick="borrarEntregaCaja('` + iEntrega.key + `')">
            delete
        </i></td>
</tr>`
        })
        $('#tablaCajaBaseEntrega').html(contenidoTablaEntrega);
    })
}

function cargarContadores() {
    db.ref(rutaDatosContadores).once('value', function(datosPremios) {
        contenidoTablaPremios = ""
        montoTotalPremios = 0;
        contadorPremios = 0;
        datosPremios.forEach(function(ipremios) {
            balanceContadorTabla = ""
            if (parseInt(ipremios.val().balance) < 0) {
                balanceContadorTabla = "<span class='red-text'> $" + puntuar(ipremios.val().balance) + "</span>"
            } else {
                balanceContadorTabla = "<span   class='green-text'> $" + puntuar(ipremios.val().balance) + "</span>"
            }
            contenidoTablaPremios += `<tr>
<td>` + puntuar(ipremios.val().maquina) + `</td>
<td>` + puntuar(ipremios.val().entrada) + `</td>
<td>` + puntuar(ipremios.val().salida) + `</td>
<td class="grey lighten-2">` + puntuar(balanceContadorTabla) + `</td>
<td>   <i class=" material-icons" onclick="cargarModalContadores('` + ipremios.key + `')">
            menu
        </i></td>
</tr>`
        })
        $('#cuerpoContadores').html(contenidoTablaPremios);
    })
}

function cargarModalContadores(llave) {
    db.ref(rutaDatosContadores + llave).once('value', function(datosPremios) {
        dat = datosPremios.val()
        $('#ModalMaquina').html('Maquina N°' + dat.maquina);
        $('#ModalDifPremios').html(puntuar("$" + dat.diferenciaOut));
        $('#ModalDifRecuadaciones').html(puntuar("$" + dat.diferenciaIn));
        $('#ModalinAyer').html(puntuar(dat.inAnterior));
        $('#ModalOutAyer').html(puntuar(dat.outAnterior));
        $('#ModalInHoy').html(puntuar(dat.inHoy));
        $('#ModalOutHoy').html(puntuar(dat.outHoy));
        $('#ModalEntrada').html("$" + puntuar(dat.entrada));
        $('#ModalSalida').html("$" + puntuar(dat.salida));
        if (parseInt(dat.balance) < 0) {
            $('#ModalBalance').html(puntuar(dat.balance)).attr('class', ' secondary-content red-text');
        } else {
            $('#ModalBalance').html(puntuar(dat.balance)).attr('class', ' secondary-content green-text');
        }
        $('#modalContadores').modal('open');
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

function cerrarJornada() {
    outHoy = 0;
    inHoy = 0;
    db.ref(rutas.jornadas + rutas.jornadaActual + "/datosImportantes/").once('value', function(numJornada) {
        gastos = 0;
        montoBalance = 0;
        montoCajaBaseJornada = 0;
        montoContadores = 0;
        montoDiferencia = 0;
        montoEntregaDeCaja = 0;
        montoGanancia = 0;
        montoRetiroCajaBaseJornada = 0;
        montoRetiroGananciaCajaBase = 0;
        premios = 0;
        recaudaciones = 0;
        console.log(numJornada.val())
        gastos = numJornada.val().gastos;
        montoBalance = numJornada.val().montoBalance;
        montoCajaBaseJornada = numJornada.val().montoCajaBaseJornada;
        montoContadores = numJornada.val().montoContadores;
        montoDiferencia = numJornada.val().montoDiferencia;
        montoEntregaDeCaja = numJornada.val().montoEntregaDeCaja;
        montoGanancia = numJornada.val().montoGanancia;
        montoRetiroCajaBaseJornada = numJornada.val().montoRetiroCajaBaseJornada;
        montoRetiroGananciaCajaBase = numJornada.val().montoRetiroGananciaCajaBase;
        premios = numJornada.val().premios;
        montoGanancia = parseInt(montoContadores) - parseInt(gastos);
        db.ref(rutas.jornadas + rutas.jornadaActual + "/datosImportantes/").update({
            montoGanancia: montoGanancia
        })
    })
    alertify.confirm('Cerrar Jornada', 'está seguro que desea cerrar la jornada actual?', function() {
        for (var i = maquinas.length - 1; i >= 0; i--) {
            db.ref(rutaDatosContadores).orderByChild("maquina").equalTo().once('value', function(datosPremios) {
                datosPremios.forEach(function(ipremios) {
                    outHoy = ipremios.val().outHoy;
                    inHoy = ipremios.val().inHoy;
                })
                db.ref('sistema/maquinas/' + sessionStorage.localcredencial + "/" + itemMaq.llaveMaquinas[i]).update({
                    outMaquina: outHoy,
                    inMaquina: inHoy
                })
            })
        }
        $('#PreLoader').show('1', function() {});
        $('#contenido').hide('1', function() {});
        rutaJornadaActual = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/";
        db.ref(rutaJornadaActual).update({
            estado: false
        })
        validarJornada();
    }, function() {});
}

function precargar() {
    db.ref(rutaDatosContadores).once('value', function(datosPremios) {
        datosPremios.forEach(function(ipremios) {
            outHoy = ipremios.val().outHoy;
            inHoy = ipremios.val().inHoy;
            for (var i = maquinas.length - 1; i >= 0; i--) {
                console.log('Maquina:' + llaveMaquinas[i]);
                console.log('in:' + inHoy);
                console.log('out:' + outHoy);
            }
        })
    })
}