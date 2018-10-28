rutaclientes = "sistema/clientes/" + sessionStorage.localactual + "/"

function guardarClientes(rut, nombre, telefono) {
    db.ref(rutaclientes).orderByChild('rut').equalTo(rut).once('value', function(datmaq) {
        estadoCliente = false;
        datmaq.forEach(function(itemmaq) {
            estadoCliente = true;
        })
        if (estadoCliente) {
            Materialize.toast('Cliente ya Registrado', 4000)
            $('#rut').val('').focus()
        } else {
            db.ref(rutaclientes).push({
                rut: rut,
                nombre: nombre,
                telefono: telefono
            })
            $('#rut').val('').focus()
            $('#nombre').val('').blur()
            $('#telefono').val('').blur()
            Materialize.toast('Cliente Agregado con Exito!', 4000)
            cargarclientes();
        }
    })
}

function cargarOpcionesCliente(llaveCliente) {
    sessionStorage.clienteActual = llaveCliente
    cargadorModulo('app', 'clientes', 'modificarCliente');
}

function cargarValoresClientes() {
    db.ref(rutaclientes + sessionStorage.clienteActual).once('value', function(datmaq) {
        datos = datmaq.val();
        $('#rut').val(datos.rut)
        $('#nombre').val(datos.nombre)
        $('#telefono').val(datos.telefono)
    })
}

function eliminarClientes(llave) {
    db.ref(rutaclientes + llave).remove()
    Materialize.toast('Cliente Modificado con Exito!', 4000);
    cargarClientes()
}

function cargarClientes() {
    $('#encabezado').html('Clientes')
    db.ref(rutaclientes).orderByChild("rut").once('value', function(datmaq) {
        contenidotablacliente = ""
        datmaq.forEach(function(itemmaq) {
            datoscliente = itemmaq.val();

            contenidotablacliente += `
            <tr>
            <td class="blue-text" style="font-size:130%;x   " >` + puntuar (datoscliente.rut) + ` </td>
            <td >` + datoscliente.nombre + ` </td>
            <td>` + datoscliente.telefono + ` </td>
            ` + puntuar(datoscliente.rut) + ` 
            <td>
            <i class=" material-icons" onclick="eliminarClientes('` + itemmaq.key + `')">
            delete
            </i> 
            </td>
            </tr>
            `
        })
        $('#listadoSorteo').html(contenidotablacliente);
      
        var tablaRec =$('#tablaClientes').DataTable({
            "pageLength": 7,
            orderCellsTop: true,
            fixedHeader: true,
            "searching": false,
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

        $('#tablaClientes thead tr').clone(true).appendTo( '#tablaClientes thead' );
        $('#tablaClientes thead tr:eq(1) th').each( function (i) {
            var title = $(this).text();
            $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
     
            $( 'input', this ).on( 'keyup change', function () {
                if ( tablaRec.column(i).search() !== this.value ) {
                    tablaRec
                        .column(i)
                        .search( this.value )
                        .draw();
                }
            } );
        } );
    })
}