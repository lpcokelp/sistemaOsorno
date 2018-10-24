rutaLocales = "sistema/locales/" + firebase.auth().currentUser.uid + "/"
$('.datepicker').pickadate({ //datepicker
    format: 'dd-mm-yyyy',
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

function cargarFiltroDetalleLocal() {
    contenidoDetalleFinanzas = ""
    recaudaciones = 0;
    premios = 0;
    gastos = 0;
    diferencias = 0;
    montoGanancia = 0;
    datosLocales.forEach(function(itemlocalF) {
        quantum = itemlocalF.datos.datosImportantes
        recaudaciones += parseInt(quantum.recaudaciones)
        diferencias += parseInt(quantum.montoDiferencia)
        premios += parseInt(quantum.premios)
        gastos += parseInt(quantum.gastos)
        montoGanancia += parseInt(quantum.montoGanancia)
    })
    $('#recaudacionesDetalle').html(recaudaciones)
    $('#premiosDetalle').html(premios)
    $('#gastosDetalle').html(gastos)
    $('#diferenciaDetalle').html(diferencias)
    $('#gananciaDetalle').html(montoGanancia)
}

function cargarDetalle(desde, hasta, opcion) {
    jornadas = [];
    sessionStorage.fechaDesde = desde;
    sessionStorage.fechaHasta = desde;
    rutaJornada = "sistema/jornadas/" + sessionStorage.localactual + "/"
    db.ref(rutaJornada).orderByChild("fecha").startAt(desde).endAt(hasta).once('value', function(datDetalle) {
        datDetalle.forEach(function(itemDetalle) {
            jornadas.push(itemDetalle)
        })
        cargadorModulo('app', 'finanzas', 'detalleDias')
    })
}

function cargarLocalSeleccionado() {
    jornadaActual = ""
    rutaJornada = "sistema/jornadas/" + sessionStorage.localactual + "/"
    db.ref(rutaJornada).once('value', function(datosuser) {
        validacionJornada = false;
        datosuser.forEach(function(itemuser) {
            console.log(itemuser.val())
            datas = itemuser.val();
            if (itemuser.val().estado == true) {
                validacionJornada = true;
                jornadaActual = itemuser.key;
            } else {
                validacionJornada = false
            }
            $('#fechaLocalSeleccionado').html(itemuser.val().fecha);
        })
        if (validacionJornada == true) {
            sessionStorage.jornadaActual = jornadaActual;
            db.ref(rutaJornada + jornadaActual + "/datosImportantes/").once('value', function(datosImp) {
                $('#recaudacionesLocalSeleccionado').html(datosImp.val().recaudaciones);
                $('#premiosLocalSeleccionado').html(datosImp.val().premios);
                $('#gastosLocalSeleccionado').html(datosImp.val().gastos);
                $('#cajaBaseLocalSeleccionado').html(datosImp.val().montoCajaBaseJornada);
                balance = parseInt(datosImp.val().recaudaciones) - parseInt(datosImp.val().premios) - parseInt(datosImp.val().gastos)
                $('#balanceLocalSeleccionado').html(balance);
                $('#depositoLocalSeleccionado').html(datosImp.val().montoGanancia)
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
}
$(document).ready(function() {
    $('select').material_select();
}); //"acordiones" que se utilizan en la vista de finanzas
function preCargarFiltro(fecha1, fecha2, opcion) {
    switch (parseInt(opcion)) {
        case 1:
            mostrarFinanzas(fecha1, fecha2)
            break;
        case 2:
            mostrarGrafico(fecha1, fecha2);
            break;
        case 3:
            cargarAnalitic(fecha1, fecha2);
            break;
    }
}

function dibujarGrafico(fechas, ganancia, premios, recaudaciones) {
    fechas.push("07-05-2018")
    console.log(fechas)
    console.log(ganancia)
    Highcharts.chart('container', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Ganancia A travez del tiempo'
        },
        xAxis: {
            categories: fechas
        },
        yAxis: {
            title: {
                text: 'Dinero'
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
            name: 'Ganancias',
            data: ganancia
        }]
    });
}

function cargarGrafico() {
    console.log('hsssssscopla')
    fechas = [];
    ganancia = [];
    premios = [];
    recaudaciones = [];
    datosLocales.forEach(function(itemlocalF) {
        fechas.push(itemlocalF.datos.fecha)
        premios.push(parseInt(itemlocalF.datos.datosImportantes.premios))
        recaudaciones.push(parseInt(itemlocalF.datos.datosImportantes.recaudaciones))
        ganancia.push(parseInt(itemlocalF.datos.datosImportantes.recaudaciones) - parseInt(itemlocalF.datos.datosImportantes.premios))
    })
    dibujarGrafico(fechas, ganancia, premios, recaudaciones)
}

function mostrarGrafico(fecha1, fecha2) {
    sessionStorage.fechaInicio = fecha1;
    sessionStorage.fechaTermino = fecha2;
    db.ref(rutaJornada).off()
    console.log('Cargando mostrarGrafico del rango de fecha,  desde :' + fecha1 + " hasta :" + fecha2);
    rutaJornada = "sistema/jornadas/" + sessionStorage.localactual + "/"
    if (fecha1 != '' && fecha2 != '') {
        contenidoLocales = ""
        db.ref(rutaJornada).orderByChild('fecha').startAt(fecha1).endAt(fecha2).once('value', function(dLocales) {
            datosLocales = []
            dLocales.forEach(function(itemlocalF) {
                datosLocales = [{
                    datos: itemlocalF.val(),
                    llave: itemlocalF.key
                }];
            })
            $('#encabezado').html("<span style='font-size:80%;'> " + sessionStorage.fechaInicio + " - " + sessionStorage.fechaTermino + "</span> ")
            cargadorModulo('app', 'finanzas', 'graficoDetalle')
        })
    } else {
        Materialize.toast('Debe ingresar 2 fechas!', 4000)
    } //muestra la card con las fechas ingresadas en el formulario
}

function mostrarFinanzas(fecha1, fecha2) {
    sessionStorage.fechaInicio = fecha1;
    sessionStorage.fechaTermino = fecha2;
    db.ref(rutaJornada).off()
    console.log('Cargando Finanzas del rango de fecha,  desde :' + fecha1 + " hasta :" + fecha2);
    rutaJornada = "sistema/jornadas/" + sessionStorage.localactual + "/"
    if (fecha1 != '' && fecha2 != '') {
        contenidoLocales = ""
        db.ref(rutaJornada).orderByChild('fecha').startAt(fecha1).endAt(fecha2).once('value', function(dLocales) {
            datosLocales = []
            dLocales.forEach(function(itemlocalF) {
                datosLocales = [{
                    datos: itemlocalF.val(),
                    llave: itemlocalF.key
                }];
            })
            $('#encabezado').html("<span style='font-size:80%;'> " + sessionStorage.fechaInicio + " - " + sessionStorage.fechaTermino + "</span> ")
            cargadorModulo('app', 'finanzas', 'detalleFinanzas')
        })
    } else {
        Materialize.toast('Debe ingresar 2 fechas!', 4000)
    } //muestra la card con las fechas ingresadas en el formulario
}

function mostrarCardFinanzas() {
    $('#contenedor').hide('100', function() {});
    $('#cardFinanzas').show('100', function() {});
    $('#rangoFechaSeleccionada').html('');
} //funcion que oculta el contenedor con los datos e inmediatamente muestra el form de busqueda por fechas