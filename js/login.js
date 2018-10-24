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

 function logear(correo, pass) {
     var control = 0;
     firebase.auth().signInWithEmailAndPassword(correo, pass).catch(function(error) {
         // Handle Errors here.
         var errorCode = error.code;
         var errorMessage = error.message;
         control = 1;
         console.log(error.code)
         if (error.code == "auth/user-not-found") {
             alertify.error("Usuario no encontrado");
         } else {
             if (error.code == "auth/wrong-password") {
                 alertify.error("Pass invalida");
             } else {}
         }
         // ...
     });
 }
 firebase.auth().onAuthStateChanged(function(user) {
     console.log(user)
     if (user) {
         db.ref(rutacuentas).orderByKey().equalTo(firebase.auth().currentUser.uid).once('value', function(datosuser) {
             datosuser.forEach(function(itemuser) {
                 sessionStorage.tipocredencial = itemuser.val().tipo;
                 sessionStorage.nombreusuario = itemuser.val().nombre;
             })
             if (sessionStorage.tipocredencial == "admin") {
                 // lo tira al panel de admin
                 location.href = "administrador/panel.html";
             } else {
                 if (sessionStorage.tipocredencial == "trabajador") {
                     // lo tira al panel de caja
                     location.href = "caja/panel.html";
                 } else {
                     // no lo tira a ningun lado y lo desconecta
                 }
             }
         })
     } else {
         console.log("no logeado")
     }
 });
 variable = {};