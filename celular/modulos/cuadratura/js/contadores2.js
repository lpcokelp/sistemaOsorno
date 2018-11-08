rutapremios = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/turnos/" + rutas.turnoactual + "/premios/"
rutaDatosTurno = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/turnos/" + rutas.turnoactual + "/datosTurno/"
rutaDatosImportantesCuadratura = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/datosImportantes/";
rutaDatosContadores = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/contadores/"
contadorPremios = 0;
rutaJornadaActual = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/";

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
                db.ref(rutaDatosContadores).orderByChild('maquina').equalTo(parseInt(maquina)).once('value', function(datosPremiosContador) {
                    diferenciaOut = 0;
                    diferenciaIn = 0;
                    inAnterior = 0;
                    outAnterior = 0;
                    inHoy = 0;
                    outHoy = 0;
                    balance = 0;
                    llaveContador = ""
                    wea("modificandoContadores");
                    datosPremiosContador.forEach(function(datosPremios) {
                        llaveContador = datosPremios.key;
                        diferenciaOut = parseInt(datosPremios.val().premiosContador);
                        diferenciaIn = parseInt(datosPremios.val().recaudacionesContador);
                        inAnterior = parseInt(InAyerTemporal);
                        outAnterior = parseInt(OutAyerTemporal);
                        inHoy =parseInt(entrada);
                        outHoy =parseInt(salida);
                        entrada = inHoy - inAnterior
                        salida = outHoy - outAnterior
                        
               
                        multiplicadorMaquina=parseInt(datosPremios.val().multiplicadorMaquina);
                        diferenciaOut = diferenciaOut - (salida * multiplicadorMaquina);
                        diferenciaIn = diferenciaIn - (entrada * multiplicadorMaquina);
                        balanceContador = entrada - salida;
                        balance = (entrada - salida) * multiplicadorMaquina;

            
                    })
                    console.log('se está actualizando los datos')
                    db.ref(rutaDatosContadores + llaveContador).update({
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
        // retiro -> recuperacion
        gastosTotales = parseInt(iCuadratura.val().gastos);
        cajabase = parseInt(iCuadratura.val().cajabase);
        premiosTotales = parseInt(iCuadratura.val().premios);
        entradas = parseInt(iCuadratura.val().entradas);
        salidas = parseInt(iCuadratura.val().salidas);
        gananciaContadores = parseInt(iCuadratura.val().gananciaContadores);
        gastos = parseInt(iCuadratura.val().gastos);
        ganancia = gananciaContadores - gastos
        recaudacionesTotales = parseInt(iCuadratura.val().recaudaciones);
        montoEntregaDeCaja = parseInt(iCuadratura.val().montoEntregaDeCaja);
        montoRetiroEntregaDeCaja = parseInt(iCuadratura.val().montoRetiroCajaBaseJornada);
        cajaBasePorRecuperar = cajabase - parseInt(cajaBaseReferenciall)
        cajaBasePorRecuperar2 = cajaBasePorRecuperar;
        cajaBasePorRecuperar3 = 0;
        cajabase2 = cajabase
        balanceDiario=ganancia;
 
        balanceDos = cajabase + ganancia - cajaBasePorRecuperar * -1
        $('#balanceDos').html(puntuar(balanceDos))
        console.log("caja base referencial ")
        diferencia = montoEntregaDeCaja - (gananciaContadores-gastos + cajabase)
        deposito = ganancia - (diferencia ); 
 

      console.log(" + contadores ->"+gananciaContadores);

      console.log("- gastos ->"+gastos);
      console.log("+ cajabase ->"+cajabase);
ne=gananciaContadores-gastos + cajabase;

      console.log("monto final"+ne);

       
      console.log("Monto entrega ->"+montoEntregaDeCaja);
      console.log("diferencia"+diferencia)


 
        $('#balanceDiario').html(puntuar(balanceDiario))
        $('#loquedeberiahaber').html(puntuar(ganancia + cajabase2 + (cajaBasePorRecuperar * -1)))
        $('#CuadraturaCajaBase').html(puntuar(cajabase2))
        $('#montoEntregaDeCaja').html(puntuar(montoEntregaDeCaja));
        $('#entrada').html(puntuar(entradas))
        $('#salida').html(puntuar(salidas))
        $('#gananciaContadores').html(puntuar(gananciaContadores))
        $('#gastos').html(puntuar(gastos))
        $('#ganancia').html(puntuar(gananciaContadores-gastos));
        $('#diferencia').html(puntuar(diferencia));
        $('#deposito').html(puntos(gananciaContadores-gastos));

        db.ref(rutaDatosImportantesCuadratura).update({
            ganancia: ganancia,
            diferencia: diferencia,
            deposito: deposito
        })
    })
}

function cargarArchivo(llaveContador) {
    const file = $('#cargadorArchivo').get(0).files[0];
    const name = (+new Date()) + '-' + file.name;
    const tipoArchivo = file.type;
    const metadata = {
        contentType: file.type
    };
    var pesoTotal = 0;
    const task = ref.child(rutaDatosContadores + llaveContador).put(file, metadata);
    $('#modal1').modal('close');
    Materialize.toast('<span class="yellow-text">Subiendo Archivo...</span>', 4000)
    db.ref(rutaDatosContadores + llaveContador).update({
        estadoArchivo: 'Subiendo'
    })
    task.on('state_changed', function(snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        pesoTotal = Math.round(snapshot.totalBytes / 1024)
        console.log('Upload is ' + progress + '% done');
        $('#divCargador').show('20', function() {});
        $('#cargadorPorcentaje').attr('style', 'width:' + progress + "%");
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
        }
    }, function(error) {
        Materialize.toast('<span class="red-text">Algo salió mal... Intenta contactar con el administrador</span>', 4000)
    }, function() {
        var downloadURL = task.snapshot.downloadURL;
        db.ref(rutaDatosContadores + llaveContador).update({
            url: task.snapshot.downloadURL
        })
        Materialize.toast('<span class="green-text">Archivo subido con Exito!</span>', 4000)
    });
}

function cargarContadores() {
    totalEntrada = 0;
    totalSalida = 0;
    db.ref(rutaDatosContadores).orderByChild("maquina").once('value', function(datosPremios) {
        contenidoTablaPremios = ""
        contenidoTablaDiferencias = ""
        contenidoTablaBalance = ""
        montoTotalPremios = 0;
        contadorPremios = 0;
        datosPremios.forEach(function(ipremios) {
            balanceContadorTabla = ""
 
            console.log(ipremios.val().maquina);
            if (parseInt(ipremios.val().balance) < 0) {
                balanceContadorTabla = "<span class='red-text'> $" + puntuar(ipremios.val().balance) + "</span>"
            } else {
                balanceContadorTabla = "<span   class='green-text'> $" + puntuar(ipremios.val().balance) + "</span>"
            }
            if (typeof ipremios.val().multiplicadorMaquina == 'undefined') {
                multis = 1;
            } else {
                multis = ipremios.val().multiplicadorMaquina
            }
            entradaFinal = parseInt(ipremios.val().entrada) * ipremios.val().multiplicadorMaquina;
            salidaFinal = parseInt(ipremios.val().salida) * multis;
            totalEntrada += entradaFinal;
            totalSalida += salidaFinal;

            contenidoTablaPremios += `<tr style="font-size:130%;">
            <td style="width:10%; font-size:140%;"><span class=" blue-text" onclick="cargarModalContadores('` + ipremios.key + `')">` + puntuar(ipremios.val().maquina) + `</span></td>
            <td style="width:45%;">` + puntuar(ipremios.val().inHoy) + `</td>
            <td style="width:45%;">` + puntuar(ipremios.val().outHoy) + `</td>
            </tr>`
                        contenidoTablaBalance += `<tr  style="font-size:130%;">
            <td style="width:10%; font-size:140%;"><span  class=" blue-text" onclick="cargarModalContadores('` + ipremios.key + `')">` + puntuar(ipremios.val().maquina) + `</span></td>
            <td style="width:30%;">` + puntuar(entradaFinal) + `</td>
            <td style="width:30%;">` + puntuar(salidaFinal) + `</td>
            <td style="width:30%;">` + puntuar(ipremios.val().balance) + `</td>
            </tr>`
                        contenidoTablaDiferencias += `<tr style="font-size:130%;">
            <td style="width:10%; font-size:140%;"><span class=" blue-text" onclick="cargarModalContadores('` + ipremios.key + `')">` + puntuar(ipremios.val().maquina) + `</span></td>
            <td style="width:45%;">` + puntuar(ipremios.val().diferenciaIn) + `</td>
            <td style="width:45%;">` + puntuar(ipremios.val().diferenciaOut) + `</td>
            </tr>`
        })
        console.log("Actualizando Montos")
        gananciaContadores = totalEntrada - totalSalida;
        db.ref(rutaDatosImportantesCuadratura).update({
            entradas: totalEntrada,
            salidas: totalSalida,
            gananciaContadores: gananciaContadores,
        })
        $('#cuerpoContadores').html(contenidoTablaPremios);
        $('#cuerpoDiferencias').html(contenidoTablaDiferencias);
        $('#cuerpoBalance').html(contenidoTablaBalance);
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
    console.log('Cerrando Jornada')
    outHoy = 0;
    inHoy = 0;
    alertify.confirm('Cerrar Jornada', 'está seguro que desea cerrar la jornada actual?', function() {
        db.ref(rutaDatosContadores).once('value', function(datContadores) {
            datContadores.forEach(function(iCont) {
                outHoy = iCont.val().outHoy;
                inHoy = iCont.val().inHoy;
                db.ref('sistema/maquinas/' + sessionStorage.localcredencial + "/" + iCont.key).update({
                    inMaquina: inHoy,
                    outMaquina: outHoy
                })
            })
            db.ref(rutas.jornadas + rutas.jornadaActual).update({
                estado: false
            })
            cerrarLocal();
        });
    }, function() {});
}