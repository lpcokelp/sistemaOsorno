function obtenerTicket() {
    rutCliente = $('#rut1').html();
    rutCliente = rutCliente.trim()
    UbicacionCliente = clientes.indexOf(rutCliente);
    if (UbicacionCliente > -1) {
        //si existe el cliente
        if (obtenerFecha() == fechaTicketclientes[UbicacionCliente]) {
            //fecha es la misma
            console.log('Existe Registro Con esa Fecha...')
            diferenciaHora = convertirHora(obtenerHora()) - convertirHora(horaTicketCliente[UbicacionCliente])
            console.log('Hora Actual:' + obtenerHora())
            console.log('Ultima Hora ' + horaTicketCliente[UbicacionCliente])
            console.log('Diferencia de hora :' + diferenciaHora)
            if (diferenciaHora > 60) {
                //diferencia mayor a 60 min
                console.log('La diferencia es mayor a 60...');
                Materialize.toast('<p style="font-size:150%;">Ticket registrado! </p>', 4000);
                contadorNuevo = 1 + parseInt(contadorTicketclientes[UbicacionCliente]);
                contadorGeneralNuevo = numUltimoCupon + 1;
                db.ref(rutaClientes + llavesClientes[UbicacionCliente]).update({
                    horaultimoticket: obtenerHora(),
                    fecha: obtenerFecha(),
                    contador: contadorNuevo,
                    contadorGeneral: contadorGeneralNuevo
                });
                sumarJackpot();
            } else {
                Materialize.toast('<p style="font-size:150%;"> Aun le faltan <span class="red-text" >' + (60 - diferenciaHora) + '</span> Minutos </p>', 4000);
            }
        } else {
            // fecha distinta
            console.log('No Existe Registro Con esa Fecha...')
            Materialize.toast('<p style="font-size:150%;">Ticket registrado! </p>', 4000);
            contadorNuevo = 1 + parseInt(contadorTicketclientes[UbicacionCliente]);
            contadorGeneralNuevo = numUltimoCupon + 1
            db.ref(rutaClientes + llavesClientes[UbicacionCliente]).update({
                horaultimoticket: obtenerHora(),
                fecha: obtenerFecha(),
                contador: contadorNuevo,
                contadorGeneral: contadorGeneralNuevo
            })
            sumarJackpot();
        }
    } else {
        //no existe el cliente
        Materialize.toast('Rut No Registrado', 4000);
    }
    $('#rut1').html('')
}