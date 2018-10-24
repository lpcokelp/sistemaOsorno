rutamaquinas = "sistema/maquinas/" + sessionStorage.localactual + "/"

function guardarMaquina(numMaquina, multiMaquina, inMaquina, outMaquina) {
    db.ref(rutamaquinas).orderByChild('numMaquina').equalTo(numMaquina).once('value', function(datmaq) {
        estadoMaquina = false;
        datmaq.forEach(function(itemmaq) {
            estadoMaquina = true;
        })
        if (estadoMaquina) {
            Materialize.toast('Maquina ya Registrada', 4000)
            $('#numMaquina').val('').focus()
        } else {
            db.ref(rutamaquinas).push({
                numMaquina: numMaquina,
                multiMaquina: multiMaquina,
                inMaquina: inMaquina,
                outMaquina: outMaquina
            })
            $('#numMaquina').val('').focus()
            $('#multiMaquina').val('10').blur()
            $('#inMaquina').val('').blur()
            $('#outMaquina').val('').blur()
            Materialize.toast('Maquina Agregada con Exito!', 4000)
            cargarmaquinas();
        }
    })
}

function cargarOpcionesMaquina(llaveMaquina) {
    sessionStorage.maquinaActual = llaveMaquina
    cargadorModulo('app', 'maquinas', 'modificarMaquina');
}

function cargarValoresModificar() {
    db.ref(rutamaquinas + sessionStorage.maquinaActual).once('value', function(datmaq) {
        datos = datmaq.val();
        $('#numMaquina').val(datos.numMaquina)
        $('#multiMaquina').val(datos.multiMaquina)
        $('#tipoMaquina').val(datos.tipoMaquina)
        $('#inMaquina').val(datos.inMaquina)
        $('#outMaquina').val(datos.outMaquina)
    })
}

function modificarMaquina(multiMaquina, inMaquina, outMaquina) {
    db.ref(rutamaquinas + sessionStorage.maquinaActual).update({
        multiMaquina: multiMaquina,
        inMaquina: inMaquina,
        outMaquina: outMaquina
    })
    Materialize.toast('Maquina Modificada con Exito!', 4000)
}

function cargarmaquinas() {
    $('#encabezado').html('Maquinas')
    db.ref(rutamaquinas).orderByChild("numMaquina").once('value', function(datmaq) {
        contenidotablamaquina = ""
        datmaq.forEach(function(itemmaq) {
            datosmaquina = itemmaq.val();
            ganancia = (parseInt(datosmaquina.inMaquina) - parseInt(datosmaquina.outMaquina))
            ganancia = ganancia * parseInt(datosmaquina.multiMaquina)
            contenidoGanancia = `<td>` + puntuar(ganancia) + `</td>`
            if (ganancia < 100000) {
                contenidoGanancia = `<td>` + puntuar(ganancia) + `</td>`
            }
            if (ganancia >= 100000 && ganancia <= 1000000) {
                contenidoGanancia = `<td class="blue-text">$` + puntuar(ganancia) + `</td>`
            }
            if (ganancia > 1000000 && ganancia < 2000000) {
                contenidoGanancia = `<td class="orange-text">$` + puntuar(ganancia) + `</td>`
            }
            if (ganancia > 20000000) {
                contenidoGanancia = `<td class="red-text">$` + puntuar(ganancia) + `</td>`
            }
            contenidotablamaquina += `
            <tr>
            <td class="blue-text" style="font-size:130%;x   " >` + datosmaquina.numMaquina + ` </td>
            <td >` + puntuar(datosmaquina.inMaquina) + ` </td>
            <td>` + puntuar(datosmaquina.outMaquina) + ` </td>
            ` + contenidoGanancia + `
            <td>
            <i class=" material-icons" onclick="cargarOpcionesMaquina('` + itemmaq.key + `')">
            menu
            </i> 
            </td>
            </tr>
            `
        })
        $('#listadomaquinas').html(contenidotablamaquina);
        altura = parseInt(screen.height);
        altura = altura * 0.6;
        estilo = 'style="max-height: ' + altura + 'px; overflow-y: scroll;"';
        $('#contenidoMaquinas').attr('style', estilo);
    }).then(function() {
        $('#tablaMaquinas').DataTable({
            language: {
                "sProcessing": "Procesando...",
                "sLengthMenu": "Mostrar _MENU_ registros",
                "sZeroRecords": "No se encontraron resultados",
                "sEmptyTable": "Ningún dato disponible en esta tabla",
                "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                "sInfoPostFix": "",
                "sSearch": "Buscar:",
                "sUrl": "",
                "sInfoThousands": ",",
                "sLoadingRecords": "Cargando...",
                "oPaginate": {
                    "sFirst": "Primero",
                    "sLast": "Último",
                    "sNext": "Siguiente",
                    "sPrevious": "Anterior"
                },
                "oAria": {
                    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                }
            }
        });
    })
}