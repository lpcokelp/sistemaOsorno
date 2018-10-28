var listaLocales = []

function cargarLocales() {
    listaLocales = []
    db.ref("sistema/locales/").once('value', function(datoslocales) {
        contenidolocales = `
           `;
        contenidobarra = "";
        datoslocales.forEach(function(itemlocal) {
            datlocales = itemlocal.val();
            console.log(datlocales)
            if (datlocales.estado == true) {
                estado = 'Abierto';
                clase = "green";
                textoMonto= `   <p> Dinero en Caja : $`+puntuar(datlocales.monto)+`</p>`
            } else {
                estado = 'Cerrado';
                clase = "grey"
                textoMonto= `   <p> Dia Anterior : $`+puntuar(datlocales.monto)+`</p>`
            }
  
            contenidolocales += `            
        <div class="col s12 m6">
        <div class="card  ` + clase + `  darken-1">
        <div class="card-content white-text">
        <div class="row">
        <div class="col s12 m12"> 
        <span class="card-title"  onclick="cargarLocal('` + itemlocal.key + `', '` + datlocales.nombre + `')">` + itemlocal.key + `</span>
        <p> Estado : `+estado+`</p>
        <br>
        `+textoMonto+`
        </div>

        </div>
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

    console.log(
        "cargandoBalances"
    );
    rutaContadores = "sistema/jornadas/"+sessionStorage.localactual+"/"+ jornadaActual + "/contadores/"
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
        $('#cuerpoBalance').html(contenidos);
        var table =$('#tablaBalance').DataTable({
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

        $('#tablaBalance thead tr').clone(true).appendTo( '#tablaPremios thead' );
        $('#tablaBalance thead tr:eq(1) th').each( function (i) {
            var title = $(this).text();
            $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
     
            $( 'input', this ).on( 'keyup change', function () {
                if ( table.column(i).search() !== this.value ) {
                    table
                        .column(i)
                        .search( this.value )
                        .draw();
                }
            } );
        } );
        $("#tablaBalance").fadeIn(2000);
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
        $('#encabezado').html('Premios');
        altura = parseInt(screen.height);
        altura = altura * 0.6;
        estilo = 'style="max-height: ' + altura + 'px; overflow-y: scroll;"';
        $('#contenidoPremios').attr('style', estilo);
    }).then(function() {
        var tablaPrem =$('#tablaPremios').DataTable({
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

        $('#tablaPremios thead tr').clone(true).appendTo( '#tablaPremios thead' );
        $('#tablaPremios thead tr:eq(1) th').each( function (i) {
            var title = $(this).text();
            $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
     
            $( 'input', this ).on( 'keyup change', function () {
                if ( tablaPrem.column(i).search() !== this.value ) {
                    tablaPrem
                        .column(i)
                        .search( this.value )
                        .draw();
                }
            } );
        } );
    })
}

function cargarRecaudaciones() {
    contenidoRecaudaciones = ""
    rutaRecaudaciones = "sistema/jornadas/" + sessionStorage.localactual + "/" + jornadaActual + "/recaudaciones/"
    db.ref(rutaRecaudaciones).once('value', function(datosuser) {
        datosuser.forEach(function(itemuser) {
         console.log("Cargando recaudaciones!!!")
            if (typeof itemuser.val().hora === "undefined") {
                hora = ""
            } else {
                hora = itemuser.val().hora
            }
            contenidoRecaudaciones += ` 
<tr>
<td >` + itemuser.val().maquina + ` </td>

<td >` + itemuser.val().monto + ` </td>
<td >` + itemuser.val().hora + ` </td>

</tr>


`
        })
        $('#encabezado').html('Recaudaciones')
        $('#contenidoRecaudaciones').html(contenidoRecaudaciones);
        altura = parseInt(screen.height);
        altura = altura * 0.6;
        estilo = 'style="max-height: ' + altura + 'px; overflow-y: scroll;"';
        $('#contenidoRecaudaciones').attr('style', estilo);
    }).then(function() {
        var tablaRec =$('#tablaRecaudaciones').DataTable({
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

        $('#tablaRecaudaciones thead tr').clone(true).appendTo( '#tablaRecaudaciones thead' );
        $('#tablaRecaudaciones thead tr:eq(1) th').each( function (i) {
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
        $('#contenidoGastos').html(contenidoGastos);
        altura = parseInt(screen.height);
        altura = altura * 0.6;
        estilo = 'style="max-height: ' + altura + 'px; overflow-y: scroll;"';
        $('#contenidoGastos').attr('style', estilo);
    }).then(function() {
        var tablaGas =$('#tablaGastos').DataTable({
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

        $('#tablaGastos thead tr').clone(true).appendTo( '#tablaGastos thead' );
        $('#tablaGastos thead tr:eq(1) th').each( function (i) {
            var title = $(this).text();
            $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
     
            $( 'input', this ).on( 'keyup change', function () {
                if ( tablaGas.column(i).search() !== this.value ) {
                    tablaGas
                        .column(i)
                        .search( this.value )
                        .draw();
                }
            } );
        } );
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