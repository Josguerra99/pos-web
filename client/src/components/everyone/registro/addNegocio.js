class AddNegocio {
  constructor(negocio, comprador, computadoras) {
    this.negocio = negocio;
    this.comprador = comprador;
    this.computadoras = computadoras;
  }

  registerNegocio(data, callback) {
    const requestData = {
      data: data
    };

    fetch("/api/addNegocio", {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(result => {
        callback(data, result["@err"]);
      });
  }

  dataToString(data) {
    var str = "";
    data.computadoras.forEach(element => {
      str += "Computadora #" + element.num + " = " + element.id + " </br>";
    });

    return str;
  }

  generateData() {
    var data = {};
    data.computadoras = [];

    for (var i = 0; i < this.computadoras; i++) {
      var c = {};
      c.num = i + 1;
      c.id = this.guid();
      data.computadoras.push(c);
    }

    var negocio = {};
    var comprador = {};
    negocio.nit = this.negocio.nit.trim();
    negocio.nombre = this.negocio.nombre.trim();
    negocio.denominacion = this.negocio.denominacion.trim();
    negocio.direccion = this.negocio.direccion.trim();
    negocio.pequeno = this.negocio.pequeno;
    negocio.juridico = this.negocio.juridica;
    data.negocio = negocio;

    comprador.user = this.comprador.user.trim();
    comprador.pass = this.comprador.pass1;

    data.comprador = comprador;

    return data;
  }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + "-" + s4();
  }
}

export default AddNegocio;
