const NC = {
  Impresora: null,
  bandera: false,
  linesAdc: 0,
  rif: "",
  razonSocial: "",
  Log: [],
  process: "init",
  precioDecimals: 2,
  cantidadDecimals: 2,
  init(
    Impresora,
    { rif, razonSocial, facturaAfectada, fechaFacturaAfectada, SerialNumber }
  ) {
    this.rif = rif;
    this.razonSocial = razonSocial;
    this.facturaAfectada = facturaAfectada;
    this.fechaFacturaAfectada = fechaFacturaAfectada;
    this.SerialNumber = SerialNumber;
    if (!Impresora) throw new Error("Impresora no inicializada");
    this.Impresora = Impresora;
    if (!this.Impresora.bandera) throw new Error("Impresora no inicializada");
    this.process = "ready";
  },
  Open: async function () {
    ///   await ControllerCommandFiscalPrinter.AbrirFacturaFiscal_MF(RazonSocial,RIF,NumFactuDev,SerialImpresora,date,hour,tipo);
    var cmd = [];
    cmd.push(ABRIR_FF);
    cmd.push(SEP);
    if (this.razonSocial)
      cmd = cmd.concat(this.Impresora.stringToDecimalArray(this.razonSocial));
    else cmd.push(NULO);
    cmd.push(SEP);
    if (this.rif)
      cmd = cmd.concat(this.Impresora.stringToDecimalArray(this.rif));
    else cmd.push(NULO);

    cmd.push(SEP);
    cmd = cmd.concat(this.Impresora.stringToDecimalArray(this.facturaAfectada));
    //NumFactuDev
    cmd.push(SEP);
    cmd = cmd.concat(this.Impresora.stringToDecimalArray(this.SerialNumber));
    cmd.push(SEP);
    const date = this.GetFormatDate();
    const hour = this.GetFormatHour();
    console.log(`Date:${date} and Hour: ${hour}`);
    cmd = cmd.concat(this.Impresora.stringToDecimalArray(date));
    cmd.push(SEP);
    cmd = cmd.concat(this.Impresora.stringToDecimalArray(hour));
    cmd.push(SEP);
    cmd.push(Nota_Credito_MF);
    cmd.push(SEP);
    //cmd.push(ESPACIO);
    cmd.push(NULO);
    cmd.push(SEP);
    cmd.push(ESPACIO);
    const result = await this.Impresora.SendCmd(cmd);
    return result;
  },
  PrintLnAdc: async function (txt) {
    var cmd = [];
    cmd.push(TEXTO_FF);
    cmd.push(SEP);
    //Desarrollo
    let NewMask = mask240; //240
    //if (CenterKeywords) NewMask = NewMask | FLAG_B;
    //if (BoldKeywords) NewMask = NewMask | FLAG_A;
    if (NewMask > 240) {
      cmd.push(NewMask);
      cmd = cmd.concat(this.Impresora.stringToDecimalArray(txt));
    } else cmd = cmd.concat(this.Impresora.stringToDecimalArray(txt));
    cmd.push(SEP);
    cmd = cmd.concat(this.Impresora.stringToDecimalArray(""));
    const result = await this.Impresora.SendCmd(cmd);
    return result;
  },
  PrintComent: async function (txt) {
    var cmd = [];
    cmd.push(TEXTO_FF);
    cmd.push(SEP);
    //Desarrollo
    let NewMask = mask240; //240
    //if (CenterKeywords) NewMask = NewMask | FLAG_B;
    //if (BoldKeywords) NewMask = NewMask | FLAG_A;
    if (NewMask > 240) {
      cmd.push(NewMask);
      cmd = cmd.concat(this.Impresora.stringToDecimalArray(txt));
    } else cmd = cmd.concat(this.Impresora.stringToDecimalArray(txt));
    cmd.push(SEP);
    cmd = cmd.concat(this.Impresora.stringToDecimalArray(""));
    const result = await this.Impresora.SendCmd(cmd);
    return result;
  },
  PrintItem: async function ({ cantidad, descripcion, precio, iva, codp }) {
    //		ControllerCommandFiscalPrinter.PrinterItemFiscal_FF(ItemDesc,Quantity,Price,TaxSale,CalificadorItemLinea);
    descripcion = descripcion.substring(0, 39);
    cantidad = this.decimals(cantidad, 3);
    cantidad = parseInt(cantidad * 1000);
    precio = this.decimals(precio, 2);
    precio = parseInt(precio * 100);
    cantidad = this.pad(cantidad, 7, "0");
    precio = this.pad(precio, 10, "0");
    //iva es 0 o 16 y hay que pasarlo a 1600
    iva = iva * 100;
    iva = this.pad(iva, 4, "0");

    const CalificadorItemLinea = "M"; //M=Venta y m=Anulacion

    var cmd = [];
    cmd.push(ITEM_FF);
    cmd.push(SEP);
    let NewMask = mask240; //240
    //if (CenterKeywords) NewMask = NewMask | FLAG_B;
    //if (BoldKeywords) NewMask = NewMask | FLAG_A;
    if (NewMask > 240) {
      cmd.push(NewMask);
      cmd = cmd.concat(this.Impresora.stringToDecimalArray(descripcion));
    } else cmd = cmd.concat(this.Impresora.stringToDecimalArray(descripcion));

    cmd.push(SEP);
    cmd = cmd.concat(this.Impresora.stringToDecimalArray(cantidad));
    cmd.push(SEP);
    cmd = cmd.concat(this.Impresora.stringToDecimalArray(precio));
    cmd.push(SEP);
    cmd = cmd.concat(this.Impresora.stringToDecimalArray(iva));
    cmd.push(SEP);
    cmd = cmd.concat(this.Impresora.stringToDecimalArray(CalificadorItemLinea));
    const result = await this.Impresora.SendCmd(cmd);
    if (codp) {
      await this.PrintCode(codp, 0x43, "I");
    }
    return result;
  },
  AddDiscountPercent: async function ({ percent }) {},
  AddCode(data) {},
  Pago({ tipo, monto }) {},
  CerrarFactura: async function () {
    var CalificadorComando = "E";
    var cmd = [];
    cmd.push(CERRAR_FF);
    cmd.push(SEP);
    cmd = cmd.concat(this.Impresora.stringToDecimalArray(CalificadorComando));
    const result = await this.Impresora.SendCmd(cmd);
    return result;
  },
  PrintCode: async function (code, type, printype) {
    var cmd = [];
    cmd.push(BARCODE);
    cmd.push(SEP);
    cmd = cmd.concat(this.Impresora.stringToDecimalArray(code));
    cmd.push(SEP);
    cmd.push(type);
    cmd.push(SEP);
    cmd = cmd.concat(this.Impresora.stringToDecimalArray(printype));
    const result = await this.Impresora.SendCmd(cmd);
    return result;
  },

  /*
    Imprimir código QR (0x2C)
  Este comando se utiliza para imprimir códigos QR en la impresora, por
  definiciones técnicas solo estará disponible para impresoras Fiscales con seriales
  igual o mayores a 760.
  */
  PrintQR: async function (code) {
    var cmd = [];
    cmd.push(0x2c);
    cmd.push(SEP);

    /*
      Alineación del código QR, valores
      permitidos:
       0x30 (0): Alineado a la izquierda
       0x31 (1): Alineación centrada
       0x32 (2): Alineado a la derecha
      */
    cmd.push(0x31);
    cmd.push(SEP);
    /*
      Nivel de corrección de error, valores
      permitidos:
       0x48: 7% de corrección de error
       0x49: 15% de corrección de error
       0x50: 25% de corrección de error
       0x51: 30% de corrección de error
      */
    cmd.push(0x48);
    cmd.push(SEP);
    /*
      Amplificación del código QR, valores
      permitidos:
       0x07 (7)
       0x08 (8)
       0x09 (9)
      */
    cmd.push(0x08);
    cmd.push(SEP);
    cmd = cmd.concat(this.Impresora.stringToDecimalArray(code));
    const result = await this.Impresora.SendCmd(cmd);
    return result;
  },

  /******************************************************************************
  FUNCIONES DE PROPOSITO GENERAL
  *********************************************************************************/

  decimals: function (x, y) {
    return Number.parseFloat(x).toFixed(y);
  },
  GetFormatHour: function () {
    var str = "";
    var currentTime = new Date();
    if (this.fechaFacturaAfectada)
      currentTime = new Date(this.fechaFacturaAfectada);
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    if (hours < 10) {
      hours = "0" + hours;
    }
    str = hours + "" + minutes + "" + seconds;
    return str;
  },
  GetFormatDate: function () {
    var str = "";
    var currentTime = new Date();
    if (this.fechaFacturaAfectada)
      currentTime = new Date(this.fechaFacturaAfectada);

    var year = currentTime.getFullYear().toString().substr(-2); //Los ultimos 2 digitos
    var day = currentTime.getDate();
    var month = currentTime.getMonth() + 1; //El mes empieza en 0(Enero) y 11(Diciembre)
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    if (year < 10) {
      year = "0" + year;
    }
    str = year + "" + month + "" + day;
    return str;
  },
  pad: function (input, length, padding) {
    var str = input + "";
    return length <= str.length
      ? str
      : this.pad(padding + str, length, padding);
  },
  OnlyNumber: function (keypress) {
    if (
      !(
        keypress.key == "." ||
        keypress.key == "0" ||
        keypress.key == "1" ||
        keypress.key == "2" ||
        keypress.key == "3" ||
        keypress.key == "4" ||
        keypress.key == "5" ||
        keypress.key == "6" ||
        keypress.key == "7" ||
        keypress.key == "8" ||
        keypress.key == "9" ||
        keypress.key == "10"
      )
    ) {
      keypress.returnValue = false;
    }
  },
};

module.exports = NC;
