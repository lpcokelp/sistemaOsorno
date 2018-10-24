var rutacuentas = "sistema/cuentas/";
var rutaJackpot = ""
var rutaClientes = "";
//variables globales
clientes = [];
llavesClientes = [];
fechaTicketclientes = [];
horaTicketCliente = [];
nombreTicketCliente = [];
contadorTicketclientes = [];
contadorGeneralTicketclientes = [];
numUltimoCupon = 0;
//aqui van las credenciales
$(document).ready(function() {
    $('ul.tabs').tabs();
});
var rutas = {};
var maquinas = [];
var estadoMaquinas = [];
var config = {
    apiKey: "AIzaSyDxZdObvwf8vc3IRkCkK4yCoHUKliEeeJU",
    authDomain: "bugsischama.firebaseapp.com",
    databaseURL: "https://bugsischama.firebaseio.com",
    projectId: "bugsischama",
    storageBucket: "bugsischama.appspot.com",
    messagingSenderId: "772178037243"
};
firebase.initializeApp(config);
var db = firebase.database();
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // cargadorModulo('app', 'locales', 'todosLosLocales');
        db.ref(rutacuentas).orderByKey().equalTo(firebase.auth().currentUser.uid).once('value', function(datosuser) {
            datosuser.forEach(function(itemuser) {
                sessionStorage.tipocredencial = itemuser.val().tipo;
                sessionStorage.nombreusuario = itemuser.val().nombre;
                sessionStorage.localcredencial = itemuser.val().local;
                rutas.admin = firebase.auth().currentUser.uid;
            })
            if (sessionStorage.tipocredencial == "admin") {
                // lo tira al inicio
                firebase.auth().signOut();
            } else {
                if (sessionStorage.tipocredencial == "trabajador") {
                    // iniciaizamos rutas
                    rutaActual = "sistema/jornadas/" + sessionStorage.localcredencial + "/"
                    rutaJackpot = "sistema/jackpot/" + sessionStorage.localcredencial
                    //buscamos la key de la ultima jornada
                    db.ref(rutaActual).orderByChild('numero').limitToLast(1).on('value', function(datosuser) {
                        validacionJornada = false;
                        datosuser.forEach(function(itemuser) {
                            //si la jornada está en true iniciamizamos la ruta de la jornada 
                            if (itemuser.val().estado == true) {
                                //jornada iniciada por lo que obtenemos las credenciales e inizializamos el sistema de ticket
                                validacionJornada = true;
                                rutas.jornadaActual = itemuser.key;
                                refJornadaAcsual = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/"
                                cargarClientes();
                            } else {
                                location.href = "../index.html"
                            }
                        })
                    })
                } else {
                    // no lo tira a ningun lado y lo desconecta
                    firebase.auth().signOut();
                }
            }
        })
    } else {
        location.href = "../index.html"
        console.log("No logeado")
    }
});

function modificarcontador1(numero) {
    db.ref(rutaJackpot).update({
        contadorCupones1: numero
    })
}

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
            console.log('Hoa Actual:' + obtenerHora())
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

function cargarClientes() {
    console.log('Sincronizando Clientes...')
    rutaClientes = "sistema/clientes/" + sessionStorage.localcredencial + "/"
    db.ref(rutaClientes).orderByChild('contadorGeneral').limitToLast(1).on('value', function(ddCli) {
        ddCli.forEach(function(iiCli) {
            numUltimoCupon = parseInt(iiCli.val().contadorGeneral);
            console.log(iiCli.val())
        })
        db.ref(rutaClientes).off();
        db.ref(rutaClientes).once('value', function(dCli) {
            clientes = [];
            llavesClientes = [];
            fechaTicketclientes = [];
            horaTicketCliente = [];
            nombreTicketCliente = [];
            contadorTicketclientes = [];
            contadorGeneralTicketclientes = [];
            dCli.forEach(function(iCli) {
                clientes.push(iCli.val().rut);
                llavesClientes.push(iCli.key);
                horaTicketCliente.push(iCli.val().horaultimoticket);
                fechaTicketclientes.push(iCli.val().fecha);
                contadorTicketclientes.push(iCli.val().contador);
                contadorGeneralTicketclientes.push(iCli.val().contadorGeneral);
                nombreTicketCliente.push(iCli.val().nombres + " " + iCli.val().apellidos);
            })
            console.log('Clientes Sincronizados!');
        })
    })
}

function cargarJackpot() {
    db.ref(rutaJackpot).update({
        contadorCupones1: 0,
        contadorCupones2: 0,
        contadorCupones3: 0,
        contadorCupones4: 0
    })
}

function guardarCliente(nombreCli, apellidoCli) {
    rutCliente = $('#rut2').html()
    db.ref(rutaClientes).push({
        nombres: nombreCli,
        apellidos: apellidoCli,
        fecha: obtenerFecha(),
        horaultimoticket: obtenerHora(),
        rut: rutCliente,
        estado: true,
        contador: 0,
        contadorGeneral: 0
    })
    $('#rut2').html('')
    $('#rut1').html('')
    Materialize.toast('<span style="font-size:150%;">Cliente Registrado y participando en los sorteos!</span>', 4000);
    $('#nombreCliente').val('');
    $('#apellidoCliente').val('');
    $('ul.tabs').tabs('select_tab', 'test1');
}

function sumarJackpot() {
    primerMonto = 0;
    segundoMonto = 0;
    tercerMonto = 0;
    cuartoMonto = 0;
    db.ref(rutaJackpot).once('value', function(snapSegundo) {
        primerMonto = parseInt(snapSegundo.val().contadorCupones1);
        segundoMonto = parseInt(snapSegundo.val().contadorCupones2);
        tercerMonto = parseInt(snapSegundo.val().contadorCupones3);
        cuartoMonto = parseInt(snapSegundo.val().contadorCupones4);
        //primero se consulta si es que el termometro mas alto va a rebentar
        if (cuartoMonto > 30) {
            // si es menor a 63 solo sumara el cuarto contador de los montos
            cuartoMonto += 1;
            db.ref(rutaJackpot).update({
                contadorCupones4: cuartoMonto
            })
        } else {
            //como segunda pregunta se analiza si el penultimo termometro va a salir pronto
            if (tercerMonto > 20) {
                //si falta poco para lanzar el tercer sorteo solo cargará este
                tercerMonto += 1;
                db.ref(rutaJackpot).update({
                    contadorCupones3: tercerMonto
                })
            } else {
                //consulta por el segundo sorteo
                if (segundoMonto > 10) {
                    //si falta pocp para el segundo sorteo solo cargará este
                    segundoMonto += 1;
                    db.ref(rutaJackpot).update({
                        contadorCupones2: segundoMonto
                    })
                } else {
                    // y al final se pregunta por el primero
                    //suma solo
                    if (primerMonto <= 4) {
                        primerMonto += 1;
                        db.ref(rutaJackpot).update({
                            contadorCupones1: primerMonto
                        })
                    } else {
                        // no cumple ninguna de las condiciones y suma a todos
                        primerMonto += 1;
                        segundoMonto += 1;
                        tercerMonto += 1;
                        cuartoMonto += 1;
                        db.ref(rutaJackpot).update({
                            contadorCupones1: primerMonto,
                            contadorCupones2: segundoMonto,
                            contadorCupones3: tercerMonto,
                            contadorCupones4: cuartoMonto
                        })
                    }
                }
            }
        }
        if (primerMonto > 5) {
            db.ref(rutaJackpot).update({
                contadorCupones1: 0
            })
        }
        if (segundoMonto > 13) {
            db.ref(rutaJackpot).update({
                contadorCupones2: 0
            })
        }
        if (tercerMonto > 25) {
            db.ref(rutaJackpot).update({
                contadorCupones3: 0
            })
        }
        if (cuartoMonto > 30) {
            db.ref(rutaJackpot).update({
                contadorCupones4: 0
            })
        }
    })
}
//----------------------------   funciones basicas ticket -------------------------
function cancelartodo(caracter) {
    $('#rut1').html('');
}

function tecladorut(caracter) {
    var varactual = $('#rut1').html();
    varactual = varactual.trim()
    varactual = quitapuntos(varactual)
    varactual = quitaguion(varactual)
    primeraparte = ""
    segundaparte = ""
    terceraparte = ""
    dgv = ""
    var pantalla = varactual + caracter;
    if (pantalla.length < 8) {
        $('#rut1').html(pantalla);
        $('#rut2').html(pantalla);
    }
    if (pantalla.length == 8) {
        primeraparte = pantalla.substring(0, 1);
        primeraparte = primeraparte + "."
        segundaparte = pantalla.substring(1, 4);
        segundaparte = segundaparte + "."
        terceraparte = pantalla.substring(4, 7)
        terceraparte = terceraparte + "-"
        dgv = pantalla.substring(7, 8);
        conpuntos = primeraparte + segundaparte + terceraparte + dgv
        $('#rut1').html(conpuntos);
        $('#rut2').html(conpuntos);
    }
    if (pantalla.length == 9) {
        primeraparte = pantalla.substring(0, 2);
        primeraparte = primeraparte + "."
        segundaparte = pantalla.substring(2, 5);
        segundaparte = segundaparte + "."
        terceraparte = pantalla.substring(5, 8)
        terceraparte = terceraparte + "-"
        dgv = pantalla.substring(8, 9);
        conpuntos = primeraparte + segundaparte + terceraparte + dgv
        $('#rut1').html(conpuntos);
        $('#rut2').html(conpuntos);
    }
}

function borrarrut() {
    $('#rut1').html('');
    $('#rut1').focus();
}

function quitapuntos(num) {
    busca = '.';
    reemplaza = '';
    while (num.indexOf(busca) != -1) {
        console.log(num + "primero")
        num = num.replace(busca, reemplaza);
    }
    return num;
}

function quitaguion(num) {
    busca = '-';
    reemplaza = '';
    while (num.indexOf(busca) != -1) {
        num = num.replace(busca, reemplaza);
    }
    return num;
}

function abrirregistro() {
    var rut1 = $('#rut1').html();
    if (rut1.length >= 9) {
        rut1 = rut1.trim();
        console.log(rut1)
        ubicacionClientes = clientes.indexOf(rut1)
        if (ubicacionClientes > -1) {
            setTimeout(function() {
                $('ul.tabs').tabs('select_tab', 'test1');
            }, 300);
            Materialize.toast('Rut ya registrado', 4000);
        } else {}
    } else {
        Materialize.toast('Rut no valido', 4000);
        setTimeout(function() {
            $('ul.tabs').tabs('select_tab', 'test1');
        }, 300);
        $('#rut1').html('');
        $('#rut2').html('');
    }
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

function convertirHora(hora) {
    hora = hora.replace(":", "");
    hora = hora.trim();
    horas = hora.substring(0, 2);
    minutos = hora.substring(2, 4);
    horas = parseInt(horas);
    horas = horas * 60
    minutos = parseInt(minutos)
    hora = horas + minutos;
    return parseInt(hora)
}

function obtenerFecha() {
    var f = new Date();
    var mes = f.getMonth() + 1;
    mes = parseInt(mes)
    var dia = f.getDate()
    dia = parseInt(dia)
    if (mes < 10) {
        mes = "0" + mes
    }
    if (dia < 10) {
        dia = "0" + dia
    }
    hoy = dia + "-" + mes + "-" + f.getFullYear()
    return hoy;
}
//----------------------------   funciones basicas ticket -------------------------