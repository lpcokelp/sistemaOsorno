             var campana = new Audio('http://chamaclub.cl/produccion/trabajadores/images/campana.mp3');
             var baliza = new Audio('http://chamaclub.cl/produccion/trabajadores/images/baliza.wav');
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
             rutas = [];
             ruta = "";
             rutaLocalJackpot = "";
             rutacupones = "";
             rutaClientes = "";
             numUltimoCupon = 0;
             var rutacuentas = "sistema/cuentas/";
             gironombreTicketCliente = [];
             giroclientes = [];
             girollavesClientes = [];
             rutaGanadoresJackpot = "";
             cronometro = setTimeout(function() {
                 console.log('se disparó el sorteo!')
             }, 100);
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
                                 rutaSorteos = "sistema/sorteos/" + sessionStorage.localcredencial + "/"
                                 ruta = "clientes/" + sessionStorage.cliente + "/locales/" + sessionStorage.localcredencial + "/";
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
                                             rutaGanadoresJackpot = "sistema/ganadores/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/"
                                             cargarClientes();
                                             prenderConcurso();
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

             function cargarClientes() {
                 console.log('Sincronizando Clientes...')
                 rutaClientes = "sistema/clientes/" + sessionStorage.localcredencial + "/"
                 cuponInicial = 0;
                 db.ref(rutaClientes).orderByChild('contadorGeneral').limitToLast(1).on('value', function(ddCli) {
                     ddCli.forEach(function(iiCli) {
                         numUltimoCupon = parseInt(iiCli.val().contadorGeneral);
                         cuponInicial = numUltimoCupon - 20
                         console.log(iiCli.val())
                     })
                     db.ref(rutaClientes).off();
                     db.ref(rutaClientes).orderByChild('contadorGeneral').startAt(cuponInicial).endAt(numUltimoCupon).once('value', function(dCli) {
                         acumulador = 0;
                         clientes = [];
                         llavesClientes = [];
                         fechaTicketclientes = [];
                         horaTicketCliente = [];
                         nombreTicketCliente = [];
                         giroclientes = [];
                         girollavesClientes = [];
                         girofechaTicketclientes = [];
                         girohoraTicketCliente = [];
                         gironombreTicketCliente = [];
                         dCli.forEach(function(iCli) {
                             if (iCli.val().estado == true && iCli.val().ultimaFechaGanador != obtenerFecha()) {
                                 acumulador += 1;
                                 console.log(acumulador)
                                 clientes.push(iCli.val().rut);
                                 llavesClientes.push(iCli.key);
                                 horaTicketCliente.push(iCli.val().horaultimoticket);
                                 fechaTicketclientes.push(iCli.val().fecha);
                                 nombreTicketCliente.push(iCli.val().nombres + " " + iCli.val().apellidos);
                             } else {}
                             giroclientes.push(iCli.val().rut);
                             girollavesClientes.push(iCli.key);
                             girofechaTicketclientes.push(iCli.val().horaultimoticket);
                             girohoraTicketCliente.push(iCli.val().fecha);
                             gironombreTicketCliente.push(iCli.val().nombres + " " + iCli.val().apellidos);
                         })
                         console.log('Clientes Sincronizados!');
                         console.log(nombreTicketCliente.length);
                         inicio = nombreTicketCliente.length - 5
                         for (var i = inicio; i <= nombreTicketCliente.length; i++) {}
                     })
                 });
             }

             function obtenerDiferenciaHora(horaInicio, horaTermino) {
                 horaActual = convertirHora(horaInicio);
                 horaSorteo = convertirHora(horaTermino);
                 diferenciaHora = horaSorteo - horaActual
                 return diferenciaHora;
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

             function prenderConcurso() {
                 pausarCronometro();
                 db.ref(rutaSorteos).orderByChild('contadorSorteo').limitToLast(1).on('value', function(dSorteos) {
                     dSorteos.forEach(function(iSorteos) {
                         datosSorteo = iSorteos.val()
                         console.log(iSorteos.val());
                         llaveSorteo = iSorteos.key;
                         if (iSorteos.val().fecha == obtenerFecha()) {
                             difHora = obtenerDiferenciaHora(obtenerHora(), iSorteos.val().hora)
                             //analizamos si la hora es igual o mayor a la actual
                             if (iSorteos.val().estado == true) {
                                 if (difHora >= 0) {
                                     dispararSorteo(difHora, datosSorteo.premio, llaveSorteo, datosSorteo.hora);
                                 } else {
                                     console.log('Hora inferior a la actual')
                                 }
                             }
                         }
                     })
                 })
             }

             function pausarCronometro() {
                 clearTimeout(cronometro);
                 console.log('Sorteo Pausado!')
             }

             function dispararSorteo(difMin, premio, llave, hora) {
                 console.log(premio + "premio")
                 miliSegundos = (difMin * 60) * 1000
                 cronometro = setTimeout(function() {
                     baliza.play()
                     setTimeout(function() {
                         campana.play();
                         gironombres(gironombreTicketCliente, giroclientes, girollavesClientes)
                         ticketelegido = Math.round(Math.random() * (nombreTicketCliente.length - 1));
                         $('#premioSorteo').html(premio);
                         $('#nombreGanador').html(nombreTicketCliente[ticketelegido])
                         $('#rutGanador').html(clientes[ticketelegido]);
                         montoConsulta = parseInt(premio);
                         db.ref(rutaGanadoresJackpot).push({
                             estado: 'revision',
                             hora: obtenerHora(),
                             rutCliente: clientes[ticketelegido],
                             nombreCliente: nombreTicketCliente[ticketelegido],
                             premio: parseInt(premio)
                         })
                         //despues de 20 segundo se abre la ventana del ganador
                         setTimeout(function() {
                             db.ref(rutaClientes + llavesClientes[ticketelegido]).update({
                                 ultimaFechaGanador: obtenerFecha(),
                                 horaultimoticket: obtenerHora()
                             })
                             db.ref(rutaSorteos + llave).update({
                                 estado: false,
                                 contadorSorteo: 0
                             })
                             $('#modalGiroNombres').modal('close');
                             $('#modalGanador').modal('open');
                             setTimeout(function() {
                                 $('#modalGanador').modal('close');
                                 prenderConcurso();
                             }, 10000);
                         }, 12000);
                     }, 12000)
                 }, miliSegundos);
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

             function animar(llave) {
                 $('#' + llave).attr('style', `
  -webkit-animation: animation 9000ms linear both;
  animation: animation 9000ms linear both;
    `);
             }

             function gironombres(nombres, rut, ticket) {
                 // giro random de todo los clientes con cupones, tanto activos como inactivos
                 $('#modalGiroNombres').modal('open');
                 $('#contenidosorteo').show('400', function() {});
                 conteo11 = 0;
                 tot = nombres.length - 1
                 setInterval(function() {
                     $('#nombreClienteSorteo').html("Nombre :" + nombres[conteo11])
                     $('#rutClienteSorteo').html("Rut :" + rut[conteo11])
                     if (conteo11 == tot) {
                         conteo11 = 0;
                     } else {
                         conteo11 = conteo11 + 1
                     }
                 }, 80);
             }
             $(document).ready(function() {
                 console.log('cargando')
                 $('#contenidoGanador').hide('400', function() {});
                 $('#billetes').hide('100', function() {});
                 $('.modal').modal();
             })