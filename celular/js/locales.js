rutaLocal="sistema/locales/"+sessionStorage.localcredencial+"/"
console.log(Math.floor(Math.random() ))
var fechaJornadaActual=""
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


function abrirLocal(rutaJornada){
    db.ref(rutaLocal).update({
        estado:true,
jornada:rutaJornada
    })
}

function actualizarValorContadores(maquinaActual) {
    db.ref(rutaDatosContadores).orderByChild('maquina').equalTo(maquinaActual).once('value', function(datosPremiosContador) {
        diferenciaOut = 0;
        diferenciaIn = 0;
        inAnterior = 0;
        outAnterior = 0;
        inHoy = 0;
        outHoy = 0;
        balance = 0;
        llaveContador = ""
        datosPremiosContador.forEach(function(datosPremios) {
            llaveContador = datosPremios.key;

            multiplicadorMaquina=parseInt(datosPremios.val().multiplicadorMaquina)
            prem = parseInt(datosPremios.val().premiosContador);
            rec = parseInt(datosPremios.val().recaudacionesContador);
            entradas = parseInt(datosPremios.val().entrada)*multiplicadorMaquina;
            salidas = parseInt(datosPremios.val().salida)*multiplicadorMaquina;
            maquina= parseInt(datosPremios.val().maquina)
            console.log(salidas+"salidas")
            difIn =(prem-salidas);
            difOut =(rec-entradas);

        })
        console.log('se está actualizando los datos')
        db.ref(rutaDatosContadores + llaveContador).update({
         
            diferenciaOut: difOut,
            diferenciaIn: difIn,
            maquina:maquina
    
        })

    })
}
function cerrarLocal(){
    db.ref(rutaLocal).update({
        estado:false
    })
}

function sincronizarJornadas(local){
    console.log(local)
    rutaLocal
    
    db.ref("sistema/locales/"+local).on('value', function(datosLocales) {
        console.log(local+" ->"+datosLocales.val().estado)
        if(datosLocales.val().estado==true){
           //existe jornada activa
           sessionStorage.estadoLocal=true;
           rutas.jornadaActual=datosLocales.val().jornada
           
           console.log("local abierto");
           cargadorModulo('app', 'turnos', 'panelTurnos')
           rutaDatosImportantesCuadratura = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/datosImportantes/";
        }else{
           sessionStorage.localactual=false;
           sessionStorage.estadoLocal=false;
           console.log("Local cerrado")
           cargadorModulo('app', 'jornada', 'inactiva')
        }
           validacionJornada = false;
   
       
       })
}

function validarJornada() {
  
    $('#tabNavegacion').html(` `)

        if ( sessionStorage.estadoLocal == "true" || sessionStorage.estadoLocal == true) {
        $('#encabezado').html('Turnos')
            cargadorModulo('app', 'turnos', 'panelTurnos')
        } else {
            rutas.jornadaActual = '';
            cargadorModulo('app', 'jornada', 'inactiva')
        }

}