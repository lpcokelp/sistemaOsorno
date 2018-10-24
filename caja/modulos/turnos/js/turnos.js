rutas.numeroturno = ""

function cajaBaseReferencial(){
    db.ref(rutas.jornadas + rutas.jornadaActual + "/turnos/").orderByChild('estado').once('value', function(datTurnos) {
    localStorage.cajaReferencia=0;
})

}

function cargarturnos() {
    cajaBaseReferencial();
    db.ref(rutas.jornadas + rutas.jornadaActual + "/turnos/").orderByChild('estado').once('value', function(datTurnos) {
        contenidoturnos = ""
        datTurnos.forEach(function(iturnos) {
            rutas.numeroturno = iturnos.val().numeroturno;
            rutas.turnoactual = iturnos.key;
            if (iturnos.val().estado == false) {
                color = "grey"
                estado = "Cerrado"
            } else {
                color = "green"
                estado = "Abierto"
            }
            contenidoturnos += `
        <li class="collection-item avatar" >
        <i class="material-icons circle ` + color + `" onclick="ingresarturno('` + iturnos.key + `','` + iturnos.val().estado + `')">
        lock_open
        </i>
        <span class="title">
        <a href="#!" class="secondary-content"><a class="teal-text">
        Estado : ` + estado + `
        </a></a>
        </span>
        <p>
        Hora Apertura: ` + iturnos.val().horaApertura + `
        <br>
        Hora Cierre: ` + iturnos.val().horaCierre + `
        </br>
        <br>
        <a class="teal-text">
        Trabajador : ` + iturnos.val().trabajador + `
        </a>  

        <a href="#!" class="secondary-content" onclick="imprimir('` + iturnos.key + `','` + iturnos.val().estado + `')"><i class="material-icons">print</i></a>                
        </li>`
        });
        $('#listadoturnos').html(contenidoturnos)
    })
}

function ingresarturno(llaveturno, estado) {
    if (estado) {
        rutas.turnoactual = llaveturno;
        cargadorModulo('app', 'caja', 'panel');
    } else {
        Materialize.toast('Turno inactivo.', 3000);
    }
}

function iniciarturno() {
    estadoturnos = false;
    numeroturno = 1;
    db.ref(rutas.jornadas + rutas.jornadaActual + "/turnos/").orderByChild('estado').once('value', function(queryturnos) {
        queryturnos.forEach(function(resultTurnos) {
            estadoturnos = resultTurnos.val().estado
            numeroturno += 1;
        })
        if (estadoturnos == true) {
            Materialize.toast('Solo se puede tener un turno activo a la vez', 3000);
        } else {
            Materialize.toast('Turno Creado', 3000);
            fecha = obtenerFecha();
            horaApertura = obtenerHora();
            horaCierre = "--:--"
            db.ref(rutas.jornadas + rutas.jornadaActual + "/turnos/").push({
                estado: true,
                horaApertura: horaApertura,
                horaCierre: horaCierre,
                fecha: fecha,
                trabajador: sessionStorage.nombreusuario,
                numeroturno: numeroturno
            }).then(function(datos) {
                db.ref(rutas.jornadas + rutas.jornadaActual + "/turnos/" + datos.key + "/cajabase/").update({
                    monto: 0
                })
                db.ref(rutas.jornadas + rutas.jornadaActual + "/turnos/" + datos.key + "/datosTurno/").update({
                    gastosTotales: 0,
                    premiosTotales: 0,
                    recaudacionesTotales: 0,
                    cajabasetotal: 0,
                    retiroCajabasetotal: 0,
                    retirogananciatotal: 0
                })
            })
            cargarturnos();
        }
    })
}
$(document).ready(function() {
    cargarturnos();
    $('#areaimprimir').hide('10', function() {});
});

function imprimir(llave, estado) {
    if (estado == 'true') {
        Materialize.toast(' <span class="green-text">Se debe cerrar el turno para poder imprimir </span>', 3000);
    } else {
        Materialize.toast(' <span class="green-text">Imprimir </span>', 3000);
        rutaDatosTurnos = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/turnos/" + rutas.turnoactual + "/datosTurno/"
        premios = 0;
        recaudaciones = 0;
        gastos = 0;
        cajabase = 0;
        retiroscajabase = 0;
        retiroganancia = 0;
        diferencia = 0;
        db.ref(rutaDatosTurnos).once('value', function(datImprimir) {
            datImp = datImprimir.val();
            premios = parseInt(datImp.premiosTotales);
            recaudaciones = parseInt(datImp.recaudacionesTotales);
            gastos = parseInt(datImp.gastosTotales);
            cajabase = parseInt(datImp.cajabasetotal);
            retiroscajabase = parseInt(datImp.retirocajabasetotal);
            retiroganancia = parseInt(datImp.retirogananciatotal);
            diferencia = parseInt(datImp.diferencia);
        })
        contenidoImprimir = `
        <p>
Nombre Cajero :` + sessionStorage.nombreusuario + `
</p>
       <p>
Hora Cierre :` + obtenerHora() + `
</p>
       <p>
Caja Base :` + cajabase + `
</p>
       <p>
Recaudaciones :` + recaudaciones + `
</p>
       <p>
Premios :` + premios + `
</p>


       <p>
Gastos :` + gastos + `
</p>

      <p>
Guardado caja :` + retiroscajabase + `
</p>
      <p>
Retiros :` + retiroganancia + `
</p>

<p>
Monto Final:` + (recaudaciones - gastos - premios + cajabase - retiroscajabase - retiroganancia) + ` 
</p>
<p>
Entrega de Caja:` + (recaudaciones - gastos - premios + cajabase - retiroscajabase - retiroganancia) + ` 
</p>
<p>
Diferencia:` + diferencia + ` 
</p>
<p>
<hr>
</p>
<p>
<hr>
</p>
<p>
Balance:` + (recaudaciones - gastos - premios) + ` 
</p>

<p>
<h5>
FIRMA Trabajador
</h5>
<br>

</br>
<br>

</br>
<br>

</br>
<hr>
</p>




        `
        $('#areaimprimir').show('10', function() {});
        $('#areaimprimir').html(contenidoImprimir);
        setTimeout(function() {
            $('#areaimprimir').printArea();
            $('#areaimprimir').hide('10', function() {});
            $('#areaimprimir').html('');
        }, 1000);
    }
}

function cargarRetiroCajaBase() {
    db.ref(rutas.jornadas + rutas.jornadaActual + "/turnos/").orderByChild('estado').once('value', function(datTurnos) {
        controlEstado = false;
        datTurnos.forEach(function(iturnos) {
            controlEstado = iturnos.val().estado;
            rutas.turnoactual = iturnos.key;
            rutas.numeroturno = iturnos.val().numeroturno;
        })
        if (controlEstado == true) {
            cargadorModulo('app', 'turnos', 'retiroscajabase');
        } else {
            Materialize.toast('Para hacer un retiro de caja , debe haber un  <span class="green-text"> TURNO ACTIVO </span>', 3000);
        }
    })
}

function cargarCajaBase() {
    db.ref(rutas.jornadas + rutas.jornadaActual + "/turnos/").orderByChild('estado').once('value', function(datTurnos) {
        controlEstado = false;
        datTurnos.forEach(function(iturnos) {
            controlEstado = iturnos.val().estado;
            rutas.turnoactual = iturnos.key;
            rutas.numeroturno = iturnos.val().numeroturno;
        })
        if (controlEstado == true) {
            cargadorModulo('app', 'turnos', 'cajabase');
        } else {
            Materialize.toast('Para agregar caja base, debe haber un  <span class="green-text"> TURNO ACTIVO </span>', 3000);
        }
    })
}