  //aqui van las credenciales
fechaActual=""
  jornadas = [];
  turnos = []
  var config = {
    apiKey: "AIzaSyCE3cr_7zL61A7qkqvMv1UFv21q84viVF4",
    authDomain: "maquinaria-f81a4.firebaseapp.com",
    databaseURL: "https://maquinaria-f81a4.firebaseio.com",
    projectId: "maquinaria-f81a4",
    storageBucket: "maquinaria-f81a4.appspot.com",
    messagingSenderId: "331739499915"
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
          cargadorModulo('app', 'locales', 'todosLosLocales');
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