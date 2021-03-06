rutaclientes = "sistema/clientes/" + sessionStorage.localactual + "/"

function guardarClientes(rut, nombre, telefono) {
    db.ref(rutaclientess).orderByChild('rut').equalTo(rut).once('value', function(datmaq) {
        estadoCliente = false;
        datmaq.forEach(function(itemmaq) {
            estadoMaquina = true;
        })
        if (estadoMaquina) {
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
            Materialize.toast('Cliente Agregada con Exito!', 4000)
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

function modificarCliente(rut, nombre, telefono) {
    db.ref(rutaclientes + sessionStorage.clienteActual).update({
        nombre: nombre,
        telefono: telefono
    })
    Materialize.toast('Cliente Modificado con Exito!', 4000)
}

function cargarclientes() {
    $('#encabezado').html('Clientes')
    db.ref(rutaclientess).orderByChild("rut").once('value', function(datmaq) {
        contenidotablacliente = ""
        datmaq.forEach(function(itemmaq) {
            datoscliente = itemmaq.val();

            contenidotablacliente += `
            <tr>
            <td class="blue-text" style="font-size:130%;x   " >` + datoscliente.rut + ` </td>
            <td >` + puntuar(datoscliente.nombre) + ` </td>
            <td>` + puntuar(datoscliente.telefono) + ` </td>
            ` + contenidoGanancia + `
            <td>
            <i class=" material-icons" onclick="cargarOpcionesCliente('` + itemmaq.key + `')">
            menu
            </i> 
            </td>
            </tr>
            `
        })
        $('#listadoclientes').html(contenidotablacliente);
        altura = parseInt(screen.height);
        altura = altura * 0.6;
        estilo = 'style="max-height: ' + altura + 'px; overflow-y: scroll;"';
        $('#contenidoClientes').attr('style', estilo);
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