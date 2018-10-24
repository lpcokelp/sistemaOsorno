contenidoTablaBorrados="";
rutaBorrados = "sistema/jornadas/" + sessionStorage.localcredencial + "/" + rutas.jornadaActual + "/turnos/" + rutas.turnoactual + "/borrados/"





 function cargarTablaBorrados(){
 	db.ref(rutaBorrados).orderByChild('estado').once('value', function(datborr) {
 	contenidoTablaBorrados=""
  	datborr.forEach(function(iBorrados) {
	valBorrados=iBorrados.val()
	contenidoTablaBorrados+=`
		<tr>
		<td>
		`+valBorrados.maquina+`
		</td>
		<td>
		`+valBorrados.tipo+`
		</td>
		<td>
		`+valBorrados.monto+`
		</td>
		<td>
		`+valBorrados.hora+`
		</td>
		</tr>
		`
		})
		$('#tablaBorrados').html(contenidoTablaBorrados);
		})
	}