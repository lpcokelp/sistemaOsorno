function iniciarJornada() {
    var numeroJornada = 0;
    var controlJornada = 0;
    var llaveUltimaJornada = 0;
    db.ref(rutas.jornadas).orderByChild('fecha').equalTo(obtenerFecha()).once('value', function(ivalJor) {
        ivalJor.forEach(function(valJornada) {
            controlJornada = 1;
            llaveUltimaJornada = valJornada.key
        })
        if (controlJornada == 1) {
            alertify.prompt('Jornada existente ', 'Se detectó una jornada existente con la fecha ' + obtenerFecha() + '. Si desea iniciar la jornada existente ingrese el codigo de seguridad.', 'Prompt Value', function(evt, value) {
                if (value = "3891") {
                    db.ref(rutas.jornadas + llaveUltimaJornada).update({
                        estado: true
                    })
                    validarJornada();
                } else {
                    Materialize.toast('Codigo Incorrecto.', 3000);
                }
            }, function() {})
        } else {
            db.ref(rutas.jornadas).orderByChild('numero').limitToLast(1).once('value', function(itemNumJornada) {
                itemNumJornada.forEach(function(numJornada) {
                    numeroJornada = numJornada.val().numero + 1;
                })
                db.ref(rutas.jornadas).push({
                    estado: true,
                    numero: numeroJornada,
                    fecha: obtenerFecha()
                }).then(function(jornada) {
                    validarJornada();
                    db.ref(rutas.jornadas + jornada.key + "/datosImportantes/").update({
                        gastos: 0,
                        premios: 0,
                        recaudaciones: 0,
                        cajaBase: 0,
                        retiros: 0,
                        entradas: 0,
                        salidas: 0,
                        gananciaContadores: 0,
                        ganancia: 0,
                        diferencia: 0,
                        montoEntregaDeCaja: 0,
                        deposito: 0
                    })
                    console.log('Inicializando Maquinas...Listo...')
                    rutaDatosContadores = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + jornada.key + "/contadores/"
                    for (var i = maquinas.length - 1; i >= 0; i--) {
                        db.ref(rutaDatosContadores + llaveMaquinas[i]).update({
                            maquina: maquinas[i],
                            premiosContador: 0,
                            recaudacionesContador: 0,
                            balanceContador: 0,
                            inAnterior: 0,
                            outAnterior: 0,
                            inHoy: 0,
                            outHoy: 0,
                            balanceHoy: 0,
                            entrada: 0,
                            salida: 0,
                            balance: 0,
                            diferenciaIn: 0,
                            diferenciaOut: 0
                        })
                    }
                })
            })
        }
    })
}