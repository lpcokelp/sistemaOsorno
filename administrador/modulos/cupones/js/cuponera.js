class Cuponera {
 
    constructor(cajaTexto, contador, ventana) {
      this.cajaTexto = cajaTexto;
      this.contador = contador;
      this.ventana = ventana;
      this.busca = '.';
      this.reemplaza = '';
      this.temporal="";
    }

    //recibe un caracter y los agrega al campo rut
agregarCaracter(caracter,actual){
    this.cajaTexto = actual;
    this.sinEspacio = this.cajaTexto.trim()
    this.cajaTexto = this.quitapuntos(this.sinEspacio)
    console.log(this.cajaTexto+"sin puntos");
    this.cajaTexto = this.quitaguion(this.cajaTexto)
    console.log(this.cajaTexto+"sin espacio ");
    this.primeraparte = ""
    this.segundaparte = ""
    this.terceraparte = ""
    this.dgv = ""
    this.cajaTexto = this.cajaTexto + caracter;
    console.log(this.cajaTexto+"largo");

    if (this.cajaTexto.length < 8) {
        $('#rut1').val(this.cajaTexto);
 
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


  }