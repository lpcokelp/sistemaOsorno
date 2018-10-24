 $('.datepicker').pickadate({
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
 $(document).ready(function() {
     // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
     $('.modal').modal(); // hace funcionar la modal
     $('select').material_select(); // esto es para que lso comnbobox funcionen
 });

 function cargarGraficoPremios(fecha1Premios, fecha2Premios) {
     if (fecha1Premios != '' && fecha2Premios != '') {
         Highcharts.chart('containerPremios', {
             chart: {
                 type: 'areaspline'
             },
             title: {
                 text: 'Premios entregados por mes'
             },
             subtitle: {
                 text: ''
             },
             xAxis: {
                 categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
             },
             yAxis: {
                 title: {
                     text: 'Dinero '
                 }
             },
             plotOptions: {
                 line: {
                     dataLabels: {
                         enabled: true
                     },
                     enableMouseTracking: false
                 }
             },
             series: [{
                 name: 'Premios',
                 data: [4000000, 1800000, 700000, 1990000, 700000, 3450005, 5002523, 6546522, 3500222, 1450005, 3050005, 2450005]
             }]
         });
         $('#busquedaPorPremios').hide('100', function() {
             $('#btnOcultarPremios').show('100', function() {});
             $('#containerPremios').show('30', function() {});
         });
     } else {
         Materialize.toast('Debe ingresar 2 fechas!', 4000)
     }
 }
 //funcion que muestra el grafico de premios
 function mostrarBusquedaPremios() {
     $('#busquedaPorPremios').show('100', function() {});
     $('#btnOcultarPremios').hide('100', function() {});
     $('#containerPremios').hide('30', function() {});
 }

 function cargarGraficoGastos(fecha1Gastos, fecha2Gastos) {
     if (fecha1Gastos != '' && fecha2Gastos != '') {
         Highcharts.chart('containerGastos', {
             chart: {
                 type: 'areaspline'
             },
             title: {
                 text: 'Gastos por mes'
             },
             subtitle: {
                 text: ''
             },
             xAxis: {
                 categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
             },
             yAxis: {
                 title: {
                     text: 'Dinero '
                 }
             },
             plotOptions: {
                 line: {
                     dataLabels: {
                         enabled: true
                     },
                     enableMouseTracking: false
                 }
             },
             series: [{
                 name: 'Gastos',
                 data: [4000000, 1800000, 700000, 1990000, 700000, 3450005, 5002523, 6546522, 3500222, 1450005, 3050005, 2450005]
             }]
         });
         $('#busquedaPorGastos').hide('100', function() {
             $('#btnOcultarGastos').show('100', function() {});
             $('#containerGastos').show('30', function() {});
         });
     } else {
         Materialize.toast('Debe ingresar 2 fechas!', 4000)
     }
 } //funcion que muestra el grafico de gastos.
 function mostrarBusquedaGastos() {
     $('#busquedaPorGastos').show('100', function() {});
     $('#btnOcultarGastos').hide('100', function() {});
     $('#containerGastos').hide('30', function() {});
 }

 function cargarGraficoGanancia(fecha1Ganancia, fecha2Ganancia, localGanancia) {
     monto = []
     fecha = []
     localS = ""
     if (fecha1Ganancia != '' && fecha2Ganancia != '') {
         db.ref("sistema/ganancia/" + localGanancia + "/").orderByChild('fecha').startAt(fecha1Ganancia).endAt(fecha2Ganancia).once('value', function(datoslocales) {
             contador = 0
             datoslocales.forEach(function(itemlocal) {
                 contador += 1
                 monto.push(itemlocal.val().monto)
                 fecha.push(itemlocal.val().fecha)
                 localS = itemlocal.val().local
             })
             if (contador > 0) {
                 Highcharts.chart('containerGanancia', {
                     chart: {
                         type: 'areaspline'
                     },
                     title: {
                         text: 'Ganancia por Fecha'
                     },
                     subtitle: {
                         text: ''
                     },
                     xAxis: {
                         categories: fecha
                     },
                     yAxis: {
                         title: {
                             text: 'Dinero '
                         }
                     },
                     plotOptions: {
                         line: {
                             dataLabels: {
                                 enabled: true
                             },
                             enableMouseTracking: false
                         }
                     },
                     series: [{
                         name: localS,
                         data: monto
                     }]
                 });
                 $('#busquedaPorGanancia').hide('100', function() {
                     $('#btnOcultarGanancia').show('100', function() {});
                     $('#containerGanancia').show('30', function() {});
                 });
             } else {
                 $('#busquedaPorGanancia').hide('30', function() {});
                 cargadorModulo('containerGanancia', 'estadisticas', 'estadisticas')
                 $('#btnOcultarGanancia').show('100', function() {});
             }
         })
     } else {
         Materialize.toast('Debe ingresar 2 fechas!', 4000)
     }
 } //funcion que muestra el grafico de ganancia
 function mostrarBusquedaGanancia() {
     $('#busquedaPorGanancia').show('100', function() {});
     $('#btnOcultarGanancia').hide('100', function() {});
     $('#containerGanancia').hide('30', function() {});
 }