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
                                 rutaLocalJackpot = "sistema/jackpot/" + sessionStorage.localcredencial + "/"
                                 ruta = "clientes/" + sessionStorage.cliente + "/locales/" + sessionStorage.localactual + "/";
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
                     db.ref(rutaClientes).orderByChild('contadorGeneral').startAt(cuponInicial).endAt(numUltimoCupon).on('value', function(dCli) {
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
                 prenderPrimero()
                 prenderSegundo();
                 prenderTercero();
                 prenderCuarto();
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

             function apagarRuta(opcion) {
                 switch (opcion) {
                     case 1:
                         db.ref(ruta + "contadorCupones1").off();
                         break;
                     case 2:
                         db.ref(ruta + "contadorCupones2").off();
                         break;
                     case 4:
                         db.ref(ruta + "contadorCupones3").off();
                         break;
                     case 4:
                         db.ref(ruta + "contadorCupones4").off();
                         break;
                     default:
                         console.log('opcion no valida')
                         break;
                 }
             }

             function prenderRuta(opcion) {
                 switch (opcion) {
                     case 1:
                         prenderPrimero();
                         break;
                     case 2:
                         prenderSegundo();
                         break;
                     case 3:
                         prenderTercero();
                         break;
                     case 4:
                         prenderCuarto();
                         break;
                     default:
                         console.log('Opcion No Valida')
                         break;
                 }
             }

             function prenderSegundo() {
                 db.ref(rutaLocalJackpot + "contadorCupones2").on('value', function(snapSegundo) {
                     console.log('segundo')
                     valdatSegundo = snapSegundo.val();
                     cantidadCupones = parseInt(valdatSegundo);
                     console.log(valdatSegundo)
                     colorSegundo = ""
                     porcentajeSegundo = 0;
                     porcentajeSegundo = cantidadCupones % 15;
                     porcentajeSegundo = Math.round((100 * porcentajeSegundo) / 15);
                     montoSegundo = (10000 * porcentajeSegundo) / 100;
                     if (porcentajeSegundo < 50) {
                         colorSegundo = "rgba(0, 255, 44, 1)"
                     }
                     if (porcentajeSegundo >= 50) {
                         colorSegundo = " rgba(255, 255, 0, 1)"
                     }
                     if (porcentajeSegundo >= 75) {
                         colorSegundo = " rgba(215, 44, 44, 1)"
                     }
                     if (cantidadCupones == 13) {
                         porcentajeSegundo = 100
                         montoSegundo = 15000
                         colorPrimero = " rgba(215, 44, 44, 1)"
                     }
                     montoSegundo = 10000;
                     setearTermometro(2, colorSegundo, porcentajeSegundo, montoSegundo);
                     switch (cantidadCupones) {
                         case 15:
                             baliza.play();
                             $('#termometro2').trigger('startRumble');
                             setTimeout(function() {
                                 lanzarConcurso(10000, 2);
                                 campana.play();
                                 $('#termometro2').trigger('stopRumble');
                             }, 3000);
                             break;
                         default:
                             // statements_def
                             break;
                     }
                 })
             }

             function prenderTercero() {
                 db.ref(rutaLocalJackpot + "contadorCupones3").on('value', function(snapTercer) {
                     valdatTercero = snapTercer.val();
                     cantidadCuponesTercero = parseInt(valdatTercero);
                     console.log(valdatTercero + "tercero")
                     colorTercero = ""
                     porcentajeTercero = 0;
                     porcentajeTercero = cantidadCuponesTercero % 25;
                     porcentajeTercero = Math.round((100 * porcentajeTercero) / 25);
                     montoTercero = (15000 * porcentajeTercero) / 100;
                     if (porcentajeTercero < 50) {
                         colorTercero = "rgba(0, 255, 44, 1)"
                     }
                     if (porcentajeTercero >= 50) {
                         colorTercero = " rgba(255, 255, 0, 1)"
                     }
                     if (porcentajeTercero >= 75) {
                         colorTercero = " rgba(215, 44, 44, 1)"
                     }
                     if (cantidadCupones == 33) {
                         montoTercero = 25000
                         colorPrimero = " rgba(215, 44, 44, 1)"
                     }
                     montoTercero = 15000;
                     setearTermometro(3, colorTercero, porcentajeTercero, montoTercero);
                     switch (cantidadCuponesTercero) {
                         case 25:
                             baliza.play();
                             // statements_1
                             $('#termometro3').trigger('startRumble');
                             campana.play()
                             setTimeout(function() {
                                 $('#termometro3').fadeOut('400', function() {});
                                 lanzarConcurso(15000, 3);
                                 campana.play();
                                 $('#termometro3').trigger('stopRumble');
                             }, 3000);
                             break;
                         default:
                             // statements_def
                             break;
                     }
                 })
             }

             function prenderCuarto() {
                 db.ref(rutaLocalJackpot + "contadorCupones4").on('value', function(snapCuarto) {
                     valdatCuarto = snapCuarto.val();
                     cantidadCuponesCuarto = parseInt(valdatCuarto);
                     console.log(valdatCuarto + "cuarto")
                     colorCuarto = ""
                     porcentajeCuarto = 0;
                     porcentajeCuarto = cantidadCuponesCuarto % 35;
                     porcentajeCuarto = Math.round((100 * porcentajeCuarto) / 35);
                     montoCuarto = (20000 * porcentajeCuarto) / 100;
                     if (porcentajeCuarto < 50) {
                         colorCuarto = "rgba(0, 255, 44, 1)"
                     }
                     if (porcentajeCuarto >= 50) {
                         colorCuarto = " rgba(255, 255, 0, 1)"
                     }
                     if (porcentajeCuarto >= 75) {
                         colorCuarto = " rgba(215, 44, 44, 1)"
                     }
                     if (cantidadCupones == 43) {
                         colorPrimero = " rgba(215, 44, 44, 1)"
                         porcentajeCuarto = 100
                         montoSegundo = 20000
                     }
                     montoCuarto = 20000;
                     setearTermometro(4, colorCuarto, porcentajeCuarto, montoCuarto);
                     switch (cantidadCuponesCuarto) {
                         case 35:
                             baliza.play();
                             // statements_1
                             $('#termometro4').trigger('startRumble');
                             setTimeout(function() {
                                 lanzarConcurso(20000, 4);
                                 campana.play();
                                 $('#termometro4').trigger('stopRumble');
                             }, 3000);
                             break;
                         default:
                             // statements_def
                             break;
                     }
                 })
             }

             function prenderPrimero() {
                 db.ref(rutaLocalJackpot + "contadorCupones1").on('value', function(snapPrimer) {
                     valdatPrimer = snapPrimer.val();
                     cantidadCupones = parseInt(valdatPrimer);
                     console.log(valdatPrimer + "primero")
                     colorPrimero = ""
                     porcentajePrimero = 0;
                     porcentajePrimero = cantidadCupones % 5;
                     console.log(porcentajePrimero + "porcentaje 1");
                     porcentajePrimero = Math.round((100 * porcentajePrimero) / 5);
                     montoPrimero = Math.round((5000 * porcentajePrimero) / 100);
                     if (porcentajePrimero < 50) {
                         colorPrimero = "rgba(0, 255, 44, 1)"
                     }
                     if (porcentajePrimero >= 50) {
                         colorPrimero = " rgba(255, 255, 0, 1)"
                     }
                     if (porcentajePrimero >= 75) {
                         colorPrimero = " rgba(215, 44, 44, 1)"
                     }
                     if (cantidadCupones == 5) {
                         porcentajePrimero = 100
                         montoPrimero = 5000
                         colorPrimero = " rgba(215, 44, 44, 1)"
                     }
                     montoPrimero = 5000
                     setearTermometro(1, colorPrimero, porcentajePrimero, montoPrimero);
                     switch (cantidadCupones) {
                         case 5:
                             baliza.play();
                             $('#termometro1').trigger('startRumble');
                             setTimeout(function() {
                                 campana.play();
                                 $('#termometro1').fadeOut('400', function() {})
                                 lanzarConcurso(5000, 1);
                                 $('#termometro1').trigger('stopRumble');
                             }, 3000);
                             // statements_1
                             break;
                         default:
                             break;
                     }
                 })
             }

             function reiniciarContador() {
                 db.ref(rutaLocalJackpot).update({
                     contadorCupones: 0
                 })
             }

             function setearTodosCupones(cantidad) {
                 db.ref(rutaLocalJackpot).update({
                     contadorCupones1: cantidad,
                     contadorCupones2: cantidad,
                     contadorCupones3: cantidad,
                     contadorCupones4: cantidad
                 })
                 console.log('Cupones establecidos en :' + cantidad)
             }

             function modificarcontador1(numero) {
                 db.ref(rutaLocalJackpot).update({
                     contadorCupones1: numero
                 })
             }

             function modificarcontador2(numero) {
                 db.ref(rutaLocalJackpot).update({
                     contadorCupones2: numero
                 })
             }

             function modificarcontador3(numero) {
                 db.ref(rutaLocalJackpot).update({
                     contadorCupones3: numero
                 })
             }

             function modificarcontador4(numero) {
                 db.ref(rutaLocalJackpot).update({
                     contadorCupones4: numero
                 })
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
                     $('#nombreClienteSorteo').html(nombres[conteo11])
                     $('#rutClienteSorteo').html(rut[conteo11])
                     if (conteo11 == tot) {
                         conteo11 = 0;
                     } else {
                         conteo11 = conteo11 + 1
                     }
                 }, 80);
             }

             function desactivarcli(llavee, rutt) {
                 db.ref(rutacupones).orderByChild('rut').equalTo(rutt).once('value', function(snapcup) {
                     snapcup.forEach(function(itemcup) {
                         db.ref(rutacupones + itemcup.key).update({
                             estado: false
                         })
                     })
                 })
                 db.ref(rutaClientes + llavee).update({
                     estado: false
                 })
             }

             function activarCli(llavee, rutt) {
                 db.ref(rutacupones).orderByChild('rut').equalTo(rutt).once('value', function(snapcup) {
                     snapcup.forEach(function(itemcup) {
                         db.ref(rutacupones + itemcup.key).update({
                             estado: false
                         })
                     })
                 })
                 db.ref(rutaClientes + llavee).update({
                     estado: true
                 })
             }

             function lanzarConcurso(monto, termometro) {
                 gironombres(gironombreTicketCliente, giroclientes, girollavesClientes)
                 ticketelegido = Math.round(Math.random() * (nombreTicketCliente.length - 1));
                 $('#montoGanador').html(monto);
                 $('#nombreGanador').html(nombreTicketCliente[ticketelegido])
                 $('#rutGanador').html(clientes[ticketelegido])
                 db.ref(rutaGanadoresJackpot).push({
                     estado: 'revision',
                     hora: obtenerHora(),
                     rutCliente: clientes[ticketelegido],
                     nombreCliente: nombreTicketCliente[ticketelegido],
                     premio: monto
                 })
                 setTimeout(function() {
                     $('#contenidoGanador').show('100', function() {});
                     $('#billetes').show('100', function() {});
                     $('#modalGiroNombres').modal('close');
                     $('#rowconcurso').hide('400', function() {});
                     $('#rowGanador').show('400', function() {});
                     $('#my-video').hide('400', function() {});
                     $('#billetes').show('100', function() {});
                     setTimeout(function() {
                         $('#contenidoGanador').hide('100', function() {});
                         $('#billetes').hide('100', function() {});
                         $('#rowconcurso').show('400', function() {});
                         $('#rowGanador').hide('400', function() {});
                         $('#my-video').show('400', function() {});
                         $('#billetes').hide('100', function() {});
                     }, 10000)
                 }, 10000)
                 switch (termometro) {
                     // selector de termometro, cuando se dispara el mas alto se desactiva 
                     case 1:
                         modificarcontador1(0)
                         $('#termometro1').fadeIn('400', function() {});
                         db.ref(rutaClientes + llavesClientes[ticketelegido]).update({
                             horaultimoticket: obtenerHora()
                         })
                         console.log('Premiando al cliente, primer tramo')
                         break;
                     case 2:
                         modificarcontador2(0)
                         $('#termometro2').fadeIn('400', function() {});
                         db.ref(rutaClientes + llavesClientes[ticketelegido]).update({
                             horaultimoticket: obtenerHora()
                         })
                         console.log('Premiando al cliente, segundo tramo')
                         break;
                     case 3:
                         modificarcontador3(0)
                         $('#termometro3').fadeIn('400', function() {});
                         db.ref(rutaClientes + llavesClientes[ticketelegido]).update({
                             ultimaFechaGanador: obtenerFecha(),
                             horaultimoticket: obtenerHora()
                         })
                         console.log('Premiando al cliente, tercer tramo')
                         break;
                     case 4:
                         modificarcontador4(0)
                         $('#termometro4').fadeIn('400', function() {});
                         db.ref(rutaClientes + llavesClientes[ticketelegido]).update({
                             ultimaFechaGanador: obtenerFecha(),
                             horaultimoticket: obtenerHora()
                         })
                         console.log('Premiando al cliente, cuarto tramo')
                         break;
                     default:
                         // statements_def
                         break;
                 }
             }

             function setearTermometro(termometro, color, porcentaje, monto) {
                 $('#base' + termometro).attr('style', `
  box-shadow: 0 0 0 5px #FFF, 0 0 0 10px #5C525F; 
  background:` + color + `;
  display: block;
  text-align: center;
  font-size: 14px;
  line-height: 60px;
  color: #FFF;
  position: absolute;
  bottom: 10px;
  left: 10px;
  width: 60px;
  height: 60px;
  border-radius: 100%;
    `);
                 $('#base' + termometro).html(porcentaje + "%");
                 $('#contenido' + termometro).attr('style', `
  background:` + color + `;
  display: block;
  width: 100%;
  height: ` + porcentaje + `%;
  border-radius: 25px 25px 0 0;
  position: absolute;
  bottom: 0;`);
             }
             $(document).ready(function() {
                 console.log('cargando')
                 $('#contenidoGanador').hide('400', function() {});
                 $('#billetes').hide('100', function() {});
                 $('#termometro1').jrumble();
                 $('#termometro2').jrumble();
                 $('#termometro3').jrumble();
                 $('#termometro4').jrumble();
                 $('.modal').modal();
             })