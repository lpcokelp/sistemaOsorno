rutaClientes = 'sistema/clientes/' + sessionStorage.localcredencial + '/'

function lawea() {
    contadorGeneral = 0;
    rutaClientes = "sistema/clientes/" + sessionStorage.localcredencial + "/"
    db.ref(rutaClientes).once('value', function(datClientes) {
        datClientes.forEach(function(iClientes) {
            console.log(iClientes.key)
            rutaClientesdos = "sistema/clientes/" + sessionStorage.localcredencial + "/" + iClientes.key
            contadorGeneral += 1;
            db.ref(rutaClientesdos).update({
                contador: 0,
                contadorGeneral: contadorGeneral,
                ultimaFechaGanador: ""
            })
        })
    })
}

function limpiarFechaClientes() {
    console.log('Reiniciando Clientes...')
    rutaClientes = "sistema/clientes/" + sessionStorage.localcredencial + "/"
    db.ref(rutaClientes).once('value', function(datClientes) {
        datClientes.forEach(function(iClientes) {
            rutaClientesdos = "sistema/clientes/" + sessionStorage.localcredencial + "/" + iClientes.key
            db.ref(rutaClientesdos).update({
                ultimaFechaGanador: "",
                fecha: "",
                horaultimoticket: ""
            })
        })
    })
}

function cargarClientes() {
    db.ref(rutaClientes).once('value', function(datClientes) {
        contenidoClientes = ''
        datClientes.forEach(function(iClientes) {
            clase = 'style="width:25%;"'
            if (iClientes.val().estado == true) {
                modificarCliente = ` <a class="btn-floating blue right" onclick="desactivarCliente('` + iClientes.key + `')">
                            <i class="material-icons">
                                power_settings_new
                            </i>
                        </a>`
            } else {
                modificarCliente = ` <a class="btn-floating grey right" onclick="activarCliente('` + iClientes.key + `')">
                            <i class="material-icons">
                                power_settings_new
                            </i>
                        </a>`
            }
            modificarCliente = ` <a class="btn-floating grey right" onclick="eliminarCliente('` + iClientes.key + `')">
                            <i class="material-icons">
                                power_settings_new
                            </i>
                        </a>`
            datCli = iClientes.val()
            contenidoClientes += `
<tr>
<td  ` + clase + `>` + datCli.nombres + `</td>
<td  ` + clase + `>` + datCli.apellidos + `</td>
<td  ` + clase + `>` + datCli.rut + `</td>
<td ` + clase + `> ` + modificarCliente + `</td>
</tr>
`
        })
        $('#tablaClientes').html(contenidoClientes);
    })
}

function buscarClientes(rutClientes) {
    console.log(rutClientes)
    if (rutClientes == '') {
        cargarClientes();
    } else {
        db.ref(rutaClientes).orderByChild('rutCliente').equalTo(rutClientes).once('value', function(datClientes) {
            contenidoClientes = ''
            datClientes.forEach(function(iClientes) {
                console.log(iClientes)
                clase = 'style="width:25%;"'
                if (iClientes.val().estado == true) {
                    modificarCliente = ` <a class="btn-floating blue right" onclick="desactivarCliente('` + iClientes.key + `')">
                            <i class="material-icons">
                                power_settings_new
                            </i>
                        </a>`
                } else {
                    modificarCliente = ` <a class="btn-floating grey right" onclick="eliminarCliente('` + iClientes.key + `')">
                            <i class="material-icons">
                                power_settings_new
                            </i>
                        </a>`
                }
                datCli = iClientes.val()
                contenidoClientes += `
<tr>
<td  ` + clase + `>` + datCli.nombres + `</td>
<td  ` + clase + `>` + datCli.apellidos + `</td>
<td  ` + clase + `>` + datCli.rut + `</td>
</tr>
`
            })
            $('#tablaClientes').html(contenidoClientes);
        })
    }
}

function activarCliente(llave) {
    alertify.confirm('Eliminar cliente', 'Desea elminar un cliente? ', function() {
        db.ref(rutaClientes + llave).update({
            estado: true
        })
        cargarClientes()
        alertify.success('Eliminado con exito')
    }, function() {
        alertify.error('Cancel')
    });
}

function desactivarCliente(llave) {
    alertify.confirm('Eliminar cliente', 'Desea desactivar un cliente? ', function() {
        db.ref(rutaClientes + llave).update({
            estado: false
        })
        cargarClientes()
        alertify.success('Eliminado con exito')
    }, function() {
        alertify.error('Cancel')
    });
}

function eliminarCliente(llave) {
    alertify.confirm('Eliminar cliente', 'Desea eliminar un cliente? ', function() {
        db.ref(rutaClientes + llave).remove();
        cargarClientes()
        alertify.success('Eliminado con exito')
    }, function() {
        alertify.error('Cancel')
    });
}