var listaLocales = []

function cargarLocales() {
    listaLocales = []
    db.ref("sistema/locales/" + firebase.auth().currentUser.uid).once('value', function(datoslocales) {
        contenidolocales = `
    <li class="collection-item avatar">

      <h4 >Locales</h4>
  
    </li>
           `;
        contenidobarra = "";
        datoslocales.forEach(function(itemlocal) {
            datlocales = itemlocal.val();
            if (datlocales.estado == true) {
                estado = 'Abierto';
                clase = "material-icons circle green"
            } else {
                estado = 'Cerrado';
                clase = "material-icons circle grey"
            }
            contenidolocales += `
    <li class="collection-item avatar" onclick="cargarLocal('` + itemlocal.key + `')">
      <i class="` + clase + `">home</i>
      <span class="title"> ` + datlocales.nombre + `</span>
      <p>Estado :<br>
    ` + estado + `       
      </p>
      <a href="#!" class="secondary-content black-text"><i class="material-icons">menu</i></a>
    </li>
`
            listaLocales.push(itemlocal.key);
        })
        $('#listadoTodosLosLocales').html(contenidolocales)
    })
}

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