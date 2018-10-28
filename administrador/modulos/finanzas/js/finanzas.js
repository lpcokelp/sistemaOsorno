//rutaLocalActual
rutaLocalActual = "sistema/jornadas/coyhaique/"
$(document).ready(function() {
    $('select').material_select();
    $('.datepicker').pickadate({ //datepicker
        format: 'yyyy-mm-dd',
        firstDay: true,
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year
        today: 'Hoy',
        clear: 'Limpiar',
        close: 'Cerrar',
        weekdaysLetter: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
        labelMonthNext: 'Mes siguiente',
        labelMonthPrev: 'Mes anterior',
        labelMonthSelect: 'Selecciona un mes',
        labelYearSelect: 'Selecciona un año',
        monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        weekdaysFull: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
    });
});
// -------------------------   finanzasLocalSeleccionado -------------------
function cargarDetalle(desde, hasta) {
    jornadas = [];
    turnos = []
    sessionStorage.fechaDesde = desde;
    sessionStorage.fechaHasta = hasta;
    db.ref(rutaLocalActual).orderByChild("fecha").startAt(desde).endAt(hasta).once('value', function(datDetalle) {
        datDetalle.forEach(function(itemDetalle) {
            jornadas.push(itemDetalle)
            turnos.push(itemDetalle.val().turnos)
        })
        cargadorModulo('app', 'finanzas', 'detalleDias')
    })
}

function alertaDetalle(contadores, gastos) {
    total = parseInt(contadores) - parseInt(gastos);
    console.log('di')
    //Materialize.toast('<span class="yellow-text"> Contadores :' + puntuar(contadores) + ' Gastos : ' + puntuar(gastos) + '</span> <p>Total :' + puntuar(total) + ' </p>', 4000);
}
// -------------------------   finanzasLocalSeleccionado -------------------
function dibujarDetalleDias() {
    console.log('funciona')
    tablaDetalleDias = ""
    sumaGanancia = 0;
    gastos = 0;
    gananciaTotal = 0;
    jornadas.forEach(function(itemDetalleDia) {
        console.log(itemDetalleDia.val() + "detalle")
        fechaActual = itemDetalleDia.val().fecha;
        gananciaActual = parseInt(itemDetalleDia.val().datosImportantes.deposito);
        if (gananciaActual < 0) {
            gananciaActual = 0;
        }
        gastos += parseInt(itemDetalleDia.val().datosImportantes.gastos);
        gananciaTotal += gananciaActual;
        tablaDetalleDias += `
     <li class="collection-item ">
                <div>
                    <span onclick="cargarFechaActual('` + itemDetalleDia.key + `')">` + fechaActual + ` </span>
                    <a class="secondary-content " href="#!"  >
                        $` + puntuar(gananciaActual) + `
                    </a>
                </div>
            </li>
`
    })
    contadoresTotal = gananciaTotal + gastos;
    $("#TotalDia").append(`  <li class="collection-item blue">
                <div class="white-text">
                   Total :
                    <a class="secondary-content white-text" href="#!" >
                        $` + puntuar(gananciaTotal) + `
                    </a>
                </div>
            </li>`)
    $('#listadoDias').html(tablaDetalleDias)
}

function cargarFechaActual(llave) {
    sessionStorage.jornadaSeleccionada = llave
    cargadorModulo('app', 'finanzas', 'diaSeleccionado');
}

function cargarGastos() {
    rutaContadores = "sistema/jornadas/coyhaique/" + sessionStorage.jornadaSeleccionada + "/gastos/"
    db.ref(rutaContadores).once('value', function(datContad) {
        contenido = ""
        total = 0;
        datContad.forEach(function(datContadores) {
            contenido += `<tr>
<td style="width: 33%;">` + puntuar(datContadores.val().monto) + `</td>
<td style="width: 33%;">` + datContadores.val().motivo + `</td>
<td style="width: 33%;">  ` + datContadores.val().hora + ` </td>
</tr>`
            total += parseInt(datContadores.val().monto)
        })
      
        $('#cuerpoGastos').html(contenido);
        
        altura = parseInt(screen.height);
        altura = altura * 0.6;
        estilo = 'style="max-height: ' + altura + 'px; overflow-y: scroll;"';
        $('#cuerpoGastos').attr('style', estilo);
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
    
function cargarContadores() {
    rutaContadores = "sistema/jornadas/coyhaique/" + sessionStorage.jornadaSeleccionada + "/contadores/"
    db.ref(rutaContadores).once('value', function(datContad) {
        contenido = ""
        total = 0;
        datContad.forEach(function(datContadores) {
            contenido += `<tr>
<td  style="width: 25%;">` + datContadores.val().maquina + `</td>
<td style="width: 25%;">` + puntuar(datContadores.val().entrada) + `</td>
<td style="width: 25%;">` + puntuar(datContadores.val().salida) + `</td>
<td style="width: 25%;">  ` + puntuar(datContadores.val().balanceContador * datContadores.val().multiplicadorMaquina) + ` </td>
</tr>`
            total += parseInt(datContadores.val().balanceContador * datContadores.val().multiplicadorMaquina)
        })
     
        $('#cuerpoContadores').html(contenido);
        
        altura = parseInt(screen.height);
        altura = altura * 0.6;
        estilo = 'style="max-height: ' + altura + 'px; overflow-y: scroll;"';
        $('#cuerpoContadores').attr('style', estilo);
    }).then(function() {
        var tablaCont =$('#tablaContadores').DataTable({
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

        $('#tablaContadores thead tr').clone(true).appendTo( '#tablaContadores thead' );
        $('#tablaContadores thead tr:eq(1) th').each( function (i) {
            var title = $(this).text();
            $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
     
            $( 'input', this ).on( 'keyup change', function () {
                if ( tablaCont.column(i).search() !== this.value ) {
                    tablaCont
                        .column(i)
                        .search( this.value )
                        .draw();
                }
            } );
        } );
    })
}
   


function cargarDiaSeleccionado() {
    db.ref(rutaLocalActual + sessionStorage.jornadaSeleccionada + "/datosImportantes/").once('value', function(datDetalleActual) {
        $('#cajaBase').html(puntuar(datDetalleActual.val().cajabase))
        $('#entradas').html(puntuar(datDetalleActual.val().entradas))
        $('#salidas').html(puntuar(datDetalleActual.val().salidas))
        $('#gananciaContadores').html(puntuar(datDetalleActual.val().gananciaContadores))
        $('#gastos').html(puntuar(datDetalleActual.val().gastos));
        $('#ganancia').html(puntuar(datDetalleActual.val().ganancia));
        $('#diferencia').html(puntuar(datDetalleActual.val().diferencia));
        $('#deposito').html(puntuar(datDetalleActual.val().deposito));
        $('#listo').show('4000', function() {});
        $('#preloader').hide('2000', function() {});
    })
}