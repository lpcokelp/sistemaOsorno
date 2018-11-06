rutaLocal = "sistema/locales/" + sessionStorage.localcredencial + "/"
console.log(Math.floor(Math.random()))
var fechaJornadaActual = ""
function cargarprueba() {
    cargadorModulo('app', 'locales', 'localSeleccionado');
}

function cargarLocal(datos) {
    sessionStorage.localactual = datos;
    cargadorModulo('app', 'locales', 'localSeleccionado');
}

function abrirlocal() {
    cargadorModulo('app', 'locales', 'menulocal');
}

//sincronizar estado local
//medinte esta sincronizacion se verificará si existe una jornada activa


function modificarMontoLocal(monto) {
    db.ref(rutaLocal).update({
        monto: monto
    })
}

function abrirLocal(rutaJornada) {
    db.ref(rutaLocal).update({
        estado: true,
        jornada: rutaJornada,
        monto: 0
    })

}

function actualizarValorContadores(maquinaActual) {
    db.ref(rutaDatosContadores).orderByChild('maquina').equalTo(parseInt(maquinaActual)).once('value', function (datosPremiosContador) {
        diferenciaOut = 0;
        diferenciaIn = 0;
        inAnterior = 0;
        outAnterior = 0;
        inHoy = 0;
        outHoy = 0;
        balance = 0;
        llaveContador = ""
        datosPremiosContador.forEach(function (datosPremios) {
            llaveContador = datosPremios.key;



            if (datosPremios.val().estado == undefined){
                wea("Aun no se toman Contadores de esta maquina") 
            }else{
                wea("modificandoContadores");
                multiplicadorMaquina = parseInt(datosPremios.val().multiplicadorMaquina)
                prem = parseInt(datosPremios.val().premiosContador);
                rec = parseInt(datosPremios.val().recaudacionesContador);
                entradas = parseInt(datosPremios.val().entrada) * multiplicadorMaquina;
                salidas = parseInt(datosPremios.val().salida) * multiplicadorMaquina;
                maquina = parseInt(datosPremios.val().maquina)
                difIn = prem - salidas;
                difOut = rec - entradas;
                db.ref(rutaDatosContadores + llaveContador).update({
                    diferenciaOut: difOut,
                    diferenciaIn: difIn,
                    maquina: maquina
                })
            }
      
        })
        console.log('se está actualizando los datos')


    })
}
function cerrarLocal() {
    db.ref(rutaLocal).update({
        estado: false
    })
}

function sincronizarJornadas(local) {

    db.ref("sistema/locales/" + local).on('value', function (datosLocales) {
        console.log(local + " ->" + datosLocales.val().estado)
        if (datosLocales.val().estado == true) {
            //existe jornada activa
            sessionStorage.estadoLocal = true;
            rutas.jornadaActual = datosLocales.val().jornada
            console.log("local abierto");
            cargadorModulo('app', 'turnos', 'panelTurnos')
            rutaDatosImportantesCuadratura = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/datosImportantes/";
        } else {
            sessionStorage.localactual = false;
            sessionStorage.estadoLocal = false;
            console.log("Local cerrado")
            cargadorModulo('app', 'jornada', 'inactiva')
        }
        validacionJornada = false;


    })
}




function validarJornada() {

    $('#tabNavegacion').html(` `)

    if (sessionStorage.estadoLocal == "true") {

      

        cargadorModulo('app', 'turnos', 'panelTurnos')
    } else {
        rutas.jornadaActual = '';
        cargadorModulo('app', 'jornada', 'inactiva')
    }

}



function cargarGastosMod() {
    console.log("Hola");
    $('#buscadorGastosMod').val('');
    rutaGastosMod="sistema/jornadas/"+sessionStorage.localcredencial+"/"+rutas.jornadaActual+"/gastos/"
    contenidoTablaPremios="";
    arregloMaquinaPremios = [];
    arregloContadorPremios = [];
    arregloMontoPremios = [];
    arregloHoraPremios = [];
    arregloKeyPremios = [];
    contadorPremios=0;
    montoTotalPremios =0;
  
    db.ref(rutaGastosMod).once('value', function (datosPremiosMod) {
  
        datosPremiosMod.forEach(function (ipremiosMod) {
            arregloMontoPremios.push(ipremiosMod.val().monto);
            arregloHoraPremios.push(ipremiosMod.val().hora);
            arregloMaquinaPremios.push(ipremiosMod.val().motivo)
            arregloKeyPremios.push(ipremiosMod.key);
            contadorPremios += 1;
            montoTotalPremios += parseInt(ipremiosMod.val().monto)
        })


            for (var i = arregloKeyPremios.length - 1; i > -1; i--) {
                contenidoTablaPremios += `<tr   id="` + arregloKeyPremios[i] + `">
                <td class=" blue-text"  width:33%;"    >` + arregloMaquinaPremios[i] + `</td>
                <td class="" style="width:33%;">` + puntos(arregloMontoPremios[i]) + `</td>
                <td class="" style="width:33%;">` + arregloHoraPremios[i] + `</td>
            
                </tr>`
            }
        
   
       
        $('#cantidadGastosMod').html(contadorPremios);

        $('#gastosTotalMod').html(puntos("" + montoTotalPremios + ""))
        $('#cuerpoGastosMod').html(contenidoTablaPremios);

    
    })
}

function cargarRecMod() {
    console.log("Hola");
    $('#buscadorRecMod').val('');
    rutaRecMod="sistema/jornadas/"+sessionStorage.localcredencial+"/"+rutas.jornadaActual+"/recaudaciones/"
    contenidoTablaPremios="";
    arregloMaquinaPremios = [];
    arregloContadorPremios = [];
    arregloMontoPremios = [];
    arregloHoraPremios = [];
    arregloKeyPremios = [];
    contadorPremios=0;
    montoTotalPremios =0;
  
    db.ref(rutaRecMod).once('value', function (datosPremiosMod) {
  
        datosPremiosMod.forEach(function (ipremiosMod) {
            arregloMontoPremios.push(ipremiosMod.val().monto);
            arregloHoraPremios.push(ipremiosMod.val().hora);
            arregloMaquinaPremios.push(ipremiosMod.val().maquina)
            arregloKeyPremios.push(ipremiosMod.key);
            contadorPremios += 1;
            montoTotalPremios += parseInt(ipremiosMod.val().monto)
        })


            for (var i = arregloKeyPremios.length - 1; i > -1; i--) {
                contenidoTablaPremios += `<tr   id="` + arregloKeyPremios[i] + `">
                <td class=" blue-text" style="font-size:130%; width:33%;"    >` + arregloMaquinaPremios[i] + `</td>
                <td class="" style="width:33%;">` + puntos(arregloMontoPremios[i]) + `</td>
                <td class="" style="width:33%;">` + arregloHoraPremios[i] + `</td>
            
                </tr>`
            }
        
   
       
        $('#cantidadRecMod').html(contadorPremios);

        $('#recTotalMod').html(puntos("" + montoTotalPremios + ""))
        $('#cuerpoRecMod').html(contenidoTablaPremios);

    
    })
}

function cargarPremiosMod() {
    console.log("Hola");
    $('#buscadorPremio').val('');
    contenidoTablaPremios="";
    arregloMaquinaPremios = [];
    arregloContadorPremios = [];
    arregloMontoPremios = [];
    arregloHoraPremios = [];
    arregloKeyPremios = [];
    contadorPremios=0;
    montoTotalPremios =0;
    rutaPremiosMod="sistema/jornadas/"+sessionStorage.localcredencial+"/"+rutas.jornadaActual+"/premios/"
    db.ref(rutaPremiosMod).orderByChild('contador').once('value', function (datosPremiosMod) {
  
        datosPremiosMod.forEach(function (ipremiosMod) {
            arregloMontoPremios.push(ipremiosMod.val().monto);
            arregloHoraPremios.push(ipremiosMod.val().hora);
            arregloMaquinaPremios.push(ipremiosMod.val().maquina)
            arregloKeyPremios.push(ipremiosMod.key);
            contadorPremios += 1;
            montoTotalPremios += parseInt(ipremiosMod.val().monto)
        })


            for (var i = arregloKeyPremios.length - 1; i > -1; i--) {
                contenidoTablaPremios += `<tr   id="` + arregloKeyPremios[i] + `">
                <td class=" blue-text" style="font-size:130%; width:33%;"    >` + arregloMaquinaPremios[i] + `</td>
                <td class="" style="width:33%;">` + puntos(arregloMontoPremios[i]) + `</td>
                <td class="" style="width:33%;">` + arregloHoraPremios[i] + `</td>
            
                </tr>`
            }
        
   
       
        $('#cantidadPremiosMod').html(contadorPremios);

        $('#premiosTotalPremiosMod').html(puntos("" + montoTotalPremios + ""))
        $('#cuerpoPremiosMod').html(contenidoTablaPremios);

    
    })
}


function buscarRecMod(numeroMaquina) {
    rutaRecMod="sistema/jornadas/"+sessionStorage.localcredencial+"/"+rutas.jornadaActual+"/recaudaciones/"
    db.ref(rutaRecMod).off();

    contadorPremios = 0;
    if (numeroMaquina == '') {
        cargarRecMod();
    } else {
  
            console.log("Hola");
            $('#buscadorPremio').val('');
            contenidoTablaPremios="";
            arregloMaquinaPremios = [];
            arregloContadorPremios = [];
            arregloMontoPremios = [];
            arregloHoraPremios = [];
            arregloKeyPremios = [];
            contadorPremios=0;
            montoTotalPremios =0;
         
            db.ref(rutaRecMod).orderByChild('maquina').equalTo(parseInt(numeroMaquina)).once('value', function (datREc) {
          
                datREc.forEach(function (iRecMod) {
                    arregloMontoPremios.push(iRecMod.val().monto);
                    arregloHoraPremios.push(iRecMod.val().hora);
                    arregloMaquinaPremios.push(iRecMod.val().maquina)
                    arregloKeyPremios.push(iRecMod.key);
                    contadorPremios += 1;
                    montoTotalPremios += parseInt(iRecMod.val().monto)
                })
        
        
                    for (var i = arregloKeyPremios.length - 1; i > -1; i--) {
                        contenidoTablaPremios += `<tr   id="` + arregloKeyPremios[i] + `">
                        <td class=" blue-text" style="font-size:130%; width:33%;"    >` + arregloMaquinaPremios[i] + `</td>
                        <td class="" style="width:33%;">` + puntos(arregloMontoPremios[i]) + `</td>
                        <td class="" style="width:33%;">` + arregloHoraPremios[i] + `</td>
           
                        </tr>`
                    }
                
           
               
                $('#cantidadRecMod').html(contadorPremios);
        
                $('#recTotalMod').html(puntos("" + montoTotalPremios + ""))
                $('#cuerpoRecMod').html(contenidoTablaPremios);
        
            
            })




    }


   
}

function buscarPremMod(numeroMaquina) {
    rutaPremiosMod="sistema/jornadas/"+sessionStorage.localcredencial+"/"+rutas.jornadaActual+"/premios/"
    db.ref(rutaPremiosMod).off();

    contadorPremios = 0;
    if (numeroMaquina == '') {
        cargarPremiosMod();
    } else {
  
            console.log("Hola");
            $('#buscadorPremio').val('');
            contenidoTablaPremios="";
            arregloMaquinaPremios = [];
            arregloContadorPremios = [];
            arregloMontoPremios = [];
            arregloHoraPremios = [];
            arregloKeyPremios = [];
            contadorPremios=0;
            montoTotalPremios =0;
            
            db.ref(rutaPremiosMod).orderByChild('maquina').equalTo(parseInt(numeroMaquina)).once('value', function (datosPremiosMod) {
          
                datosPremiosMod.forEach(function (ipremiosMod) {
                    arregloMontoPremios.push(ipremiosMod.val().monto);
                    arregloHoraPremios.push(ipremiosMod.val().hora);
                    arregloMaquinaPremios.push(ipremiosMod.val().maquina)
                    arregloKeyPremios.push(ipremiosMod.key);
                    contadorPremios += 1;
                    montoTotalPremios += parseInt(ipremiosMod.val().monto)
                })
        
        
                    for (var i = arregloKeyPremios.length - 1; i > -1; i--) {
                        contenidoTablaPremios += `<tr   id="` + arregloKeyPremios[i] + `">
                        <td class=" blue-text" style="font-size:130%; width:33%;"    >` + arregloMaquinaPremios[i] + `</td>
                        <td class="" style="width:33%;">` + puntos(arregloMontoPremios[i]) + `</td>
                        <td class="" style="width:33%;">` + arregloHoraPremios[i] + `</td>
           
                        </tr>`
                    }
                
           
               
                $('#cantidadPremiosMod').html(contadorPremios);
        
                $('#premiosTotalPremiosMod').html(puntos("" + montoTotalPremios + ""))
                $('#cuerpoPremiosMod').html(contenidoTablaPremios);
        
            
            })




    }


   
}