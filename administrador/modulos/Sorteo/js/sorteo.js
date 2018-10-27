rutaSorteo = "sistema/Sorteo/" + sessionStorage.localactual + "/"

function guardarSorteo(fecha, hora, premio) {

            db.ref(rutaSorteo).push({
                fecha: fecha,
                hora: hora,
                premio: premio
            })
       
            $('#hora').val('').blur()
            $('#premio').val('').blur()
            const swalWithBootstrapButtons = swal.mixin({
                confirmButtonClass: 'btn-large white blue-text lighten-1',
                cancelButtonClass: 'btn-large grey blue-text lighten-3',
                buttonsStyling: false,
              })
              
              swalWithBootstrapButtons({
                title: 'Deseas agregar otro Sorteo?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si',
                cancelButtonText: 'No',
                reverseButtons: true
              }).then((result) => {
                if (result.value) {
             
                } else if (
                  // Read more about handling dismissals
                  result.dismiss === swal.DismissReason.cancel
                ) {
             

                    cargadorModulo('app', 'Sorteo', 'panelSorteo');

                }
              })
        
 
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
    $("#"+llaveSorteo).remove()
    Materialize.toast('Se a eliminado un sorteo!', 4000)
}

function cargarSorteo() {
    $('#encabezado').html('Sorteo')
    db.ref(rutaSorteo).orderByChild("fecha").once('value', function(datmaq) {
        contenidoTablaSorteo = ""
        datmaq.forEach(function(itemmaq) {
            datosSorteo = itemmaq.val();

            contenidoTablaSorteo += `
            <tr id = "` + itemmaq.key + `">
            <td class="blue-text" style="font-size:130%;x   " >` + datosSorteo.fecha + ` </td>
            <td >` + datosSorteo.hora + ` </td>
            <td>` + datosSorteo.premio + ` </td>
            <td>
            <i class=" material-icons" onclick="eliminarSorteo('` + itemmaq.key + `')">
            delete
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