var listaLocales = []

function cargarLocales() {
    listaLocales = []
    db.ref("sistema/locales/" + firebase.auth().currentUser.uid).once('value', function(datoslocales) {
        contenidolocales = `
           `;
        contenidobarra = "";
        datoslocales.forEach(function(itemlocal) {
            datlocales = itemlocal.val();
            console.log(datlocales)
            if (datlocales.estado == true) {
                estado = 'Abierto';
                clase = "green"
            } else {
                estado = 'Cerrado';
                clase = "grey"
            }
            clase = 'green'
            contenidolocales += `            
        <div class="col s12 m6">
        <div class="card  ` + clase + `  darken-1">
        <div class="card-content white-text">
        <div class="row">
        <div class="col s12 m12"> 
        <span class="card-title">` + datlocales.nombre + `</span>
        </div>

        </div>
        </div>
        <div class="card-action  ` + clase + `  darken-3 white-text" >
        <a href="#!"  onclick="cargarLocal('` + itemlocal.key + `', '` + datlocales.nombre + `')"><i class="material-icons">menu</i></a>
        </div>
        </div>
        </div>
        `
            listaLocales.push(itemlocal.key);
        })
        $('#listadoTodosLosLocales').html(contenidolocales)
        $("#preloader").hide('300', function() {});
        $('#listo').show('300', function() {});
    })
}

function cargarBalances() {
    rutaContadores = "sistema/jornadas/coyhaique/" + jornadaActual + "/contadores/"
    db.ref(rutaContadores).once('value', function(datContad) {
        contenidos = ""
        total = 0;
        datContad.forEach(function(datContadoress) {
            console.log(datContadoress.val().hora)
            if (typeof datContadoress.val().hora === "undefined") {
                hora = ""
            } else {
                hora = datContadoress.val().hora
            }
            contenidos += "<tr>";
            contenidos += '<td style="width:10%; font-size:150%;" class="blue-text">' + datContadoress.val().maquina + '</td>'
            contenidos += '<td style="width:25%;">' + puntuar(parseInt(datContadoress.val().recaudacionesContador)) + '</td>';
            contenidos += '<td style="width:25%;">' + puntuar(parseInt(datContadoress.val().premiosContador)) + '</td>';
            contenidos += '<td style="width:25%;">' + puntuar(parseInt(datContadoress.val().recaudacionesContador) - parseInt(datContadoress.val().premiosContador)) + '</td>';
            contenidos += '<td style="width:15%;">  ' + hora + '</td></tr>'
        })
        $('#tablaBalance').html(contenidos)
    })
}

function cargarprueba() {
    cargadorModulo('app', 'locales', 'localSeleccionado');
}

function cargarPremios() {
    contenidoPremios = ""
    rutaPremios = "sistema/jornadas/" + sessionStorage.localactual + "/" + jornadaActual + "/premios/"
    db.ref(rutaPremios).once('value', function(datosuser) {
        datosuser.forEach(function(itemuser) {
            contenidoPremios += ` 
<tr>
<td style="width:33%;">` + itemuser.val().maquina + ` </td>

<td style="width:33%;">` + itemuser.val().monto + ` </td>
<td style="width:33%;">` + itemuser.val().hora + ` </td>

</tr>


`
        })
        $('#contenidoPremios').html(contenidoPremios)
        $('#encabezado').html('Premios')
    })
}

function cargarRecaudaciones() {
    contenidoRecaudaciones = ""
    rutaRecaudaciones = "sistema/jornadas/" + sessionStorage.localactual + "/" + jornadaActual + "/recaudaciones/"
    db.ref(rutaRecaudaciones).once('value', function(datosuser) {
        datosuser.forEach(function(itemuser) {
            console.log(itemuser.val().hora)
            if (typeof itemuser.val().hora === "undefined") {
                hora = ""
            } else {
                hora = itemuser.val().hora
            }
            contenidoRecaudaciones += ` 
<tr>
<td style="width:33%;">` + itemuser.val().maquina + ` </td>

<td style="width:33%;">` + itemuser.val().monto + ` </td>

</tr>


`
        })
        $('#encabezado').html('Recaudaciones')
        $('#contenidoRecaudaciones').html(contenidoRecaudaciones)
    })
}

function cargarGastos() {
    $('#encabezado').html(fechaActual + '/Gastos')
    contenidoGastos = ""
    rutaGastos = "sistema/jornadas/" + sessionStorage.localactual + "/" + jornadaActual + "/gastos/"
    db.ref(rutaGastos).once('value', function(datosuser) {
        datosuser.forEach(function(itemuser) {
            console.log(itemuser.val())
            contenidoGastos += ` 
<tr>
<td style="width:25%;">` + puntuar(itemuser.val().monto) + ` </td>
<td style="width:25%;">` + itemuser.val().motivo + ` </td>
<td style="width:25%;">` + itemuser.val().hora + ` </td>
<td style="width:25%;">` + itemuser.val().tipo + ` </td>
</tr>`
        })
        $('#contenidoGastos').html(contenidoGastos)
    })
}

function cargarLocal(datos, nombreLocal) {
    sessionStorage.localactual = datos;
    $('#encabezado').html(nombreLocal)
    cargadorModulo('app', 'locales', 'localSeleccionado');
}

function abrirlocal(llaveLocal, nombreLocal) {
    cargadorModulo('app', 'locales', 'menulocal');
}
//metodos del archivo local Seleccionado
function cargarLocalSeleccionado() {
    jornadaActual = ""
    rutaJornada = "sistema/jornadas/" + sessionStorage.localactual + "/"
    db.ref(rutaJornada).orderByChild("fecha").limitToLast(1).once('value', function(datosuser) {
        validacionJornada = true;
        datosuser.forEach(function(datosJornada) {
            jornadaActual = datosJornada.key;
            fechaActual = datosJornada.val().fecha;
            $('#fechaLocalSeleccionado').html(datosJornada.val().fecha);
        })
        if (validacionJornada == true) {
            db.ref(rutaJornada + jornadaActual + "/datosImportantes/").once('value', function(datosImp) {
                $('#recaudacionesLocalSeleccionado').html(puntuar(datosImp.val().recaudaciones));
                $('#premiosLocalSeleccionado').html(puntuar(datosImp.val().premios));
                $('#gastosLocalSeleccionado').html(puntuar(datosImp.val().gastos));
                $('#cajaBaseLocalSeleccionado').html(puntuar(datosImp.val().cajabase));
                balance = parseInt(datosImp.val().recaudaciones) - parseInt(datosImp.val().premios) - parseInt(datosImp.val().gastos)
                $('#balanceLocalSeleccionado').html(puntuar(balance));
            })
        } else {
            $('#depositoLocalSeleccionado').html(0)
            $('#recaudacionesLocalSeleccionado').html(0);
            $('#premiosLocalSeleccionado').html(0);
            $('#gastosLocalSeleccionado').html(0);
            $('#cajaBaseLocalSeleccionado').html(0);
            balance = 0;
            $('#balanceLocalSeleccionado').html(balance);
        }
    })
    $('#listo').show('4000', function() {});
    $('#preloader').hide('2000', function() {});
}