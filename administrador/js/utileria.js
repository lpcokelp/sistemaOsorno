function cargarNotificaciones() {
    db.ref("sistema/notificaciones/coyhaique/").orderByChild('fecha').equalTo(obtenerFecha()).on('value', function(snapNoti) {
        contenidoNotificaciones = ""
        acumuladorNotificaciones = 0;
        notificaciones = [];
        snapNoti.forEach(function(datNoti) {
            datNotificaciones = datNoti.val();
            notificaciones.push(datNotificaciones);
            acumuladorNotificaciones += 1;
        })
        for (let index = notificaciones.length - 1; index >= 0; index--) {
            const element = notificaciones[index];
            contenidoNotificaciones += `
    <li class="collection-item">
    <div >` + element.detalle + `<a href="#!" class="secondary-content">
    ` + element.hora + `
    </a>
    </div>
    </li>
    `
        }
        $("#notificacionesPC").html(`
` + acumuladorNotificaciones + `
<i class="material-icons right">notifications</i>

`)
        $("#notificacionesCelu").html(`
` + acumuladorNotificaciones + `


`)
        $('#listadoNotificaciones').html(contenidoNotificaciones)
    })
}

function obtenerHora() {
    var ho = new Date();
    hora1 = parseInt(ho.getHours())
    minutos1 = parseInt(ho.getMinutes())
    if (hora1 < 10) {
        hora1 = '0' + hora1
    }
    if (minutos1 < 10) {
        minutos1 = '0' + minutos1
    }
    if (hora1 == '23' && minutos1 == '59') {
        localStorage.controldia = 0;
    }
    horaact = hora1 + ":" + minutos1;
    return horaact;
}

function validarmaquina(maq) {
    control = false
    for (var i = maquinas.length - 1; i >= 0; i--) {
        if (maq == parseInt(maquinas[i])) {
            control = true
        }
    }
    return control;
}

function obtenerPosMaquina() {
    control = 0
    for (var i = maquinas.length - 1; i >= 0; i--) {
        if (maq == parseInt(maquinas[i])) {
            control = i
        }
    }
    return control;
}

function iniciarMaquinas() {}

function obtenerFecha() {
    var f = new Date();
    var mes = f.getMonth() + 1;
    mes = parseInt(mes)
    var dia = f.getDate()
    dia = parseInt(dia)
    if (dia < 10) {
        dia = "0" + dia
    }
    if (mes < 10) {
        mes = "0" + mes
    }
    hoy = f.getFullYear() + "-" + mes + "-" + dia
    return hoy;
}

function obtenerPrimerDia() {
    var f = new Date();
    var mes = f.getMonth() + 1;
    mes = parseInt(mes)
    var dia = f.getDate()
    dia = parseInt(dia)
    if (dia < 10) {
        dia = "0" + dia
    }
    if (mes < 10) {
        mes = "0" + mes
    }
    hoy = f.getFullYear() + "-" + mes + "-01"
    return hoy;
}

function puntos(numero) {
    numero = numero.toString()
    if (numero.substring(0, 1) == "-") {
        signo = "-"
        var numero = numero.replace("-", "");
    } else {
        signo = ""
    }
    largo = numero.length
    switch (largo) {
        case 4:
            respuesta = "$" + signo + numero.substring(0, 1) + "." + numero.substring(1, 4)
            return respuesta;
            break;
        case 5:
            respuesta = "$" + signo + numero.substring(0, 2) + "." + numero.substring(2, 5)
            return respuesta;
            break;
        case 6:
            respuesta = "$" + signo + numero.substring(0, 3) + "." + numero.substring(3, 6)
            return respuesta;
            break;
        case 7:
            respuesta = "$" + signo + numero.substring(0, 1) + "." + numero.substring(1, 4) + "." + numero.substring(4, 7)
            return respuesta;
            break;
        case 8:
            respuesta = "$" + signo + numero.substring(0, 2) + "." + numero.substring(2, 5) + "." + numero.substring(5, 8)
            return respuesta;
            break;
        default:
            return numero = "$" + signo + numero
    }
}

function puntuar(numero) {
    numero = numero.toString()
    if (numero.substring(0, 1) == "-") {
        signo = "-"
        var numero = numero.replace("-", "");
    } else {
        signo = ""
    }
    largo = numero.length
    switch (largo) {
        case 4:
            respuesta = "" + signo + numero.substring(0, 1) + "." + numero.substring(1, 4)
            return respuesta;
            break;
        case 5:
            respuesta = "" + signo + numero.substring(0, 2) + "." + numero.substring(2, 5)
            return respuesta;
            break;
        case 6:
            respuesta = "" + signo + numero.substring(0, 3) + "." + numero.substring(3, 6)
            return respuesta;
            break;
        case 7:
            respuesta = "" + signo + numero.substring(0, 1) + "." + numero.substring(1, 4) + "." + numero.substring(4, 7)
            return respuesta;
            break;
        case 8:
            respuesta = "" + signo + numero.substring(0, 2) + "." + numero.substring(2, 5) + "." + numero.substring(5, 8)
            return respuesta;
            break;
        default:
            return numero = "" + signo + numero
    }
}

function puntuarInput(value, id) {
    nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    valor = value.toString() + "";
    if (valor.length == 1) {
        // aqui evaluo el primer digito, si este corresponde a un numero todo sigue bien, en caso contrario se limpiara las variables
        if (valor == '1' || valor == '2' || valor == '3' || valor == '4' || valor == '5' || valor == '6' || valor == '7' || valor == '8' || valor == '9') {} else {
            value = ""
            valor = ""
            $('#' + id).val('');
        }
    }
    if (value.substring(0, 1) == "N") {
        $('#' + id).val('');
        value = ""
    } else {}
    if (value == "") {} else {
        var value = value.replace(".", "");
        var value = value.replace(".", "");
        var value = value.replace(".", "");
        value = parseInt(value);
        value = value.toString()
        switch (value.length) {
            case 4:
                var primera = value.substring(0, 1);
                var segunda = value.substring(1, 4);
                var final = primera + "." + segunda;
                $('#' + id).val(final);
                break;
            case 5:
                var primera = value.substring(0, 2);
                var segunda = value.substring(2, 5);
                var final = primera + "." + segunda;
                $('#' + id).val(final);
                break;
            case 6:
                var primera = value.substring(0, 3);
                var segunda = value.substring(3, 6);
                var final = primera + "." + segunda;
                $('#' + id).val(final);
                break;
            case 7:
                var primera = value.substring(0, 1);
                var segunda = value.substring(1, 4);
                var tercera = value.substring(4, 7);
                var final = primera + "." + segunda + "." + tercera;
                $('#' + id).val(final);
                break;
            case 8:
                var primera = value.substring(0, 2);
                var segunda = value.substring(2, 5);
                var tercera = value.substring(5, 8);
                var final = primera + "." + segunda + "." + tercera;
                $('#' + id).val(final);
                break;
            case 9:
                var primera = value.substring(0, 3);
                var segunda = value.substring(3, 6);
                var tercera = value.substring(6, 9);
                var final = primera + "." + segunda + "." + tercera;
                $('#' + id).val(final);
                break;
            case 10:
                var primera = value.substring(0, 1);
                var segunda = value.substring(1, 4);
                var tercera = value.substring(4, 7);
                var tercera = value.substring(7, 10);
                var final = primera + "." + segunda + "." + tercera;
                $('#' + id).val(final);
                break;
            default:
                //Sentencias_def ejecutadas cuando no ocurre una coincidencia con los anteriores casos
                final = value
                $('#' + id).val(final);
                break;
        }
    }
}