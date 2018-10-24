rutaSorteo = "sistema/Sorteo/" + sessionStorage.localactual + "/"

function guardarSorteo(fecha, hora, premio) {
    db.ref(rutaSorteo).orderByChild('fecha').equalTo(fecha).once('value', function(datmaq) {
        estadoSorteo = false;
        datmaq.forEach(function(itemmaq) {
            estadoSorteo = true;
        })
        if (estadoSorteo) {
            Materialize.toast('Sorteo ya Registrado', 4000)
            $('#fecha').val('').focus()
        } else {
            db.ref(rutaSorteo).push({
                fecha: fecha,
                hora: hora,
                premio: premio
            })
            $('#fecha').val('').focus()
            $('#hora').val('').blur()
            $('#premio').val('').blur()
            Materialize.toast('Sorteo Agregado con Exito!', 4000)
            cargarSorteo();
        }
    })
}

function cargarOpcionesSorteo(llaveSorteo) {
    sessionStorage.SorteoActual = llavSorteo
    cargadorModulo('app', 'Sorteo', 'modificarSorteo');
}

function cargarValoresSorteo() {
    db.ref(rutaSorteo + sessionStorage.SorteoActual).once('value', function(datmaq) {
        datos = datmaq.val();
        $('#fecha').val(datos.fecha)
        $('#hora').val(datos.hora)
        $('#premio').val(datos.premio)
    })
}

function eliminarSorteo(llaveSorteo) {
    db.ref(rutaSorteo + llaveSorteo).remove()
    Materialize.toast('Sorteo Modificado con Exito!', 4000)
}

function cargarSorteo() {
    $('#encabezado').html('Sorteo')
    db.ref(rutaSorteo).orderByChild("fecha").on('value', function(datmaq) {
        contenidoTablaSorteo = ""
        datmaq.forEach(function(itemmaq) {
            datosSorteo = itemmaq.val();

            contenidoTablaSorteo += `
            <tr>
            <td class="blue-text" style="font-size:130%;x   " >` + datosSorteo.fecha + ` </td>
            <td >` + puntuar(datosSorteo.hora) + ` </td>
            <td>` + puntuar(datosSorteo.premio) + ` </td>
            <td>
            <i class=" material-icons" onclick="eliminarSorteo('` + itemmaq.key + `')">
            remove
            </i> 
            </td>
            </tr>
            `
        })
        $('#listadoSorteo').html(contenidoTablaSorteo);
        altura = parseInt(screen.height);
        altura = altura * 0.6;
        estilo = 'style="max-height: ' + altura + 'px; overflow-y: scroll;"';
        $('#contenidoSorteo').attr('style', estilo);
    }).then(function() {
        $('#tablaSorteo').DataTable({
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