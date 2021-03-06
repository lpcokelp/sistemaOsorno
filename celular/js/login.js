  //aqui van las credenciales
  var rutas = {};
  var maquinas = [];
  var llaveMaquinas = [];
  var estadoMaquinas = [];
  var config = {
    apiKey: "AIzaSyCE3cr_7zL61A7qkqvMv1UFv21q84viVF4",
    authDomain: "maquinaria-f81a4.firebaseapp.com",
    databaseURL: "https://maquinaria-f81a4.firebaseio.com",
    projectId: "maquinaria-f81a4",
    storageBucket: "maquinaria-f81a4.appspot.com",
    messagingSenderId: "331739499915"
  };
  firebase.initializeApp(config);
  var db = firebase.database();
  //aqui van las credenciales
  var rutacuentas = "sistema/cuentas/";
  firebase.auth().onAuthStateChanged(function(user) {
      console.log(user)
      if (user) {
          
          // cargadorModulo('app', 'locales', 'todosLosLocales');
          db.ref(rutacuentas).orderByKey().equalTo(firebase.auth().currentUser.uid).once('value', function(datosuser) {
              datosuser.forEach(function(itemuser) {
                  sessionStorage.tipocredencial = itemuser.val().tipo;
                  sessionStorage.nombreusuario = itemuser.val().nombre;
                  sessionStorage.localcredencial = itemuser.val().local;
                  rutas.admin = firebase.auth().currentUser.uid;
                  rutas.jornadas = 'sistema/jornadas/' + sessionStorage.localcredencial + '/';
             
                  cargarmaquinas();
                  sincronizarJornadas(sessionStorage.localcredencial);
              })
              if (sessionStorage.tipocredencial == "admin") {
                  // lo tira al panel de admin  
                  firebase.auth().signOut();
              } else {
                  if (sessionStorage.tipocredencial == "celular") {
                      // lo tira al panel de caja
                      cargarBarra("barraNavegacion", "barraNavegacion", "barraNavegacion");
                      // An error happened.
                  } else {

                    if (sessionStorage.tipocredencial == "trabajador") {
                        // lo tira al panel de caja
                        firebase.auth().signOut();
                        // An error happened.
                    }
                      // no lo tira a ningun lado y lo desconecta
                  }
              }
          })
      } else {
          location.href = "../index.html"
          console.log("no logeado")
      }
  });


  cajaBaseReferenciall=0;
  cajaBasePorRecuperar=0;

    rutaLocal="sistema/locales/"+sessionStorage.localcredencial+"/"

  function cargarmaquinas() {

      db.ref('sistema/maquinas/' + sessionStorage.localcredencial).once('value', function(datmaq) {
          datmaq.forEach(function(itemMaq) {
              llaveMaquinas.push(itemMaq.key);
              maquinas.push(itemMaq.val().numMaquina);
              estadoMaquinas.push(false)
          })
      })
  }


  

  function cerrarsession() {
      alertify.confirm('Cerrar Session', 'Esta seguro que desea cerrar sesion?', function() {
          firebase.auth().signOut();
      }, function() {})
  }