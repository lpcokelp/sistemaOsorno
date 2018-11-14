class Cuponera {
    constructor(cajaTexto, contador, ventana) {
      this.cajaTexto = cajaTexto;
      this.contador = contador;
      this.ventana = ventana;
      this.busca = '.';
      this.reemplaza = '';
      this.temporal="";
      this.rutSeleccionado;
      this.rutaCupones="sistema/osorno/clientes/";
      this.validarEstado=false;
    }
    //recibe un caracter y los agrega al campo rut
agregarCaracter(caracter,actual){
    this.cajaTexto = actual;
    this.sinEspacio = this.cajaTexto.trim()
    this.cajaTexto = this.quitapuntos(this.sinEspacio)
    this.cajaTexto = this.quitaguion(this.cajaTexto)
    this.primeraparte = ""
    this.segundaparte = ""
    this.terceraparte = ""
    this.dgv = ""
    this.cajaTexto = this.cajaTexto + caracter;
    if (this.cajaTexto.length < 8) {
        $('#rut1').val(this.cajaTexto);
        $('#rut2').val(this.cajaTexto);
    }
    if (this.cajaTexto.length == 8) {
        console.log("di")
        this.primeraparte = this.cajaTexto.substring(0, 1);
        this.primeraparte = this.primeraparte + "."
        this.segundaparte = this.cajaTexto.substring(1, 4);
        this.segundaparte = this.segundaparte + "."
        this.terceraparte = this.cajaTexto.substring(4, 7)+"-"
        this.dgv = this.cajaTexto.substring(7, 8);
        this.conpuntos = this.primeraparte + this.segundaparte + this.terceraparte + this.dgv
        $('#rut1').val(this.conpuntos);
        $('#rut2').val(this.conpuntos);
   
    }
    if (this.cajaTexto.length == 9) {
        console.log("prueba :"+this.cajaTexto)
        this.primeraparte = this.cajaTexto.substring(0, 2);
        this.primeraparte = this.primeraparte + "."
        this.segundaparte = this.cajaTexto.substring(2, 5);
        this.segundaparte = this.segundaparte + "."
        this.terceraparte = this.cajaTexto.substring(5, 8)
        this.terceraparte = this.terceraparte + "-"
        this.dgv = this.cajaTexto.substring(8, 10);
        this.conpuntos = this.primeraparte + this.segundaparte + this.terceraparte + this.dgv
        $('#rut1').val(this.conpuntos);
        $('#rut2').val(this.conpuntos);
     
    }
}


 quitapuntos(num) {

    while (num.indexOf(".") != -1) {
      
        num = num.replace(".", "");
   
    }
    return num;
}

 quitaguion(num) {
   
    while (num.indexOf("-") != -1) {
        num = num.replace("-", "");
    }
    return num;
}

limpiarRut(){
    $('#rut1').val("");
}


crearCliente(nombreCliente,apellidoCliente){

  this.rutCli=$('#rut1').val();

  db.ref(this.rutaCupones).push({
    rut:this.rutCli,
    nombre:nombreCliente,
    apellido:apellidoCliente
  })
  Materialize.toast('Cliente registrado y participando en el sorteo!', 4000)

}

registrarCupon(nombreCliente,apellidoCliente){
    this.rutSeleccionado=$('#rut1').val();

    $('#rut1').val('');
  
    swal({
        position: 'top-end',
        type: 'success',
        title: 'Ya estas participando en el Sorteo',
        showConfirmButton: false,
        timer: 5000
      })


    
}


  }