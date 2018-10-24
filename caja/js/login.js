  //aqui van las credenciales
  var rutas = {};
  var maquinas = [];
  var llaveMaquinas = [];
  var estadoMaquinas = [];
  var config = {
    apiKey: "AIzaSyAaMeosluNyleN-sIehjUApL-K1f4k4Et8",
    authDomain: "osorno-50720.firebaseapp.com",
    databaseURL: "https://osorno-50720.firebaseio.com",
    projectId: "osorno-50720",
    storageBucket: "osorno-50720.appspot.com",
    messagingSenderId: "245571353819"
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
                  validarJornada();
                  cargarmaquinas();
              })
              if (sessionStorage.tipocredencial == "admin") {
                  // lo tira al panel de admin  
                  firebase.auth().signOut();
              } else {
                  if (sessionStorage.tipocredencial == "trabajador") {
                      // lo tira al panel de caja
                      cargarBarra("barraNavegacion", "barraNavegacion", "barraNavegacion");
                      // An error happened.
                  } else {
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
    db.ref('sistema/locales/' +"coyhaique").once('value', function(datCo) {
        console.log(cajaBaseReferenciall+"Caja base "+datCo.val().cajaBase)
        cajaBaseReferenciall=datCo.val().cajaBase;
        
    })


  function cargarmaquinas() {

      db.ref('sistema/maquinas/' + sessionStorage.localcredencial).once('value', function(datmaq) {
          datmaq.forEach(function(itemMaq) {
              console.log(itemMaq.val());
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