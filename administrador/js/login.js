  //aqui van las credenciales
fechaActual=""
  jornadas = [];
  turnos = []
  var config = {
    apiKey: "AIzaSyAaMeosluNyleN-sIehjUApL-K1f4k4Et8",
    authDomain: "osorno-50720.firebaseapp.com",
    databaseURL: "https://osorno-50720.firebaseio.com",
    projectId: "osorno-50720",
    storageBucket: "osorno-50720.appspot.com",
    messagingSenderId: "245571353819"
  };
  sessionStorage.localactual="coyhaique"
  firebase.initializeApp(config);
  var db = firebase.database();
  //aqui van las credenciales
  var rutacuentas = "sistema/cuentas/";
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
          datosLocales = [];
          cargarBarra("barraNavegacion", "barraNavegacion", "barraNavegacion");
          cargadorModulo('app', 'locales', 'localSeleccionado');
          db.ref(rutacuentas).orderByKey().equalTo(firebase.auth().currentUser.uid).once('value', function(datosuser) {
              datosuser.forEach(function(itemuser) {
                  sessionStorage.tipocredencial = itemuser.val().tipo;
                  sessionStorage.nombreusuario = itemuser.val().nombre;
              })
              if (sessionStorage.tipocredencial == "admin") {
                  // lo tira al panel de admin
              } else {
                  if (sessionStorage.tipocredencial == "trabajador") {
                      // lo tira al panel de caja
                      firebase.auth().signOut();
                      // An error happened.
                  } else {
                      // no lo tira a ningun lado y lo desconecta
                  }
              }
          })
      } else {
          location.href = "../index.html"
      }
  });




  function cerrarsession() {
      alertify.confirm('Cerrar Session', 'Esta seguro que desea cerrar session?', function() {
          firebase.auth().signOut();
      }, function() {})
  }