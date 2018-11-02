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
                    if (sessionStorage.tipocredencial == "celular") {
                        // lo tira al panel de caja
                        location.href = "celular/panel.html";
                    }
                     // no lo tira a ningun lado y lo desconecta
                 }
             }
         })
     } else {
         console.log("no logeado")
     }
 });
 variable = {};