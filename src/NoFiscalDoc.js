const NoFiscalDoc = {
  Impresora: null,
  bandera: false,
  init(Impresora) {
    if (!Impresora) throw new Error('Impresora no inicializada');
    this.Impresora = Impresora;
    if (!this.Impresora.bandera) throw new Error('Impresora no inicializada');
  },
  //Apertura el documento No Fiscal
  Apertura: async function () {
    const result = await this.Impresora.SendCmd(ABRIR_DOC_NO_FF);
  },
  //Efecto negrita
  Bold: async function (txt) {
    var cmd = [];
    cmd.push(TEXTO_DOC_NO_FF);
    cmd.push(SEP);
    let NewMask = mask240; //240
    //if (CenterKeywords) NewMask = NewMask | FLAG_B;
    NewMask = NewMask | FLAG_A; //BOLD
    if (NewMask > 240) {
      cmd.push(NewMask);
      cmd = cmd.concat(this.Impresora.stringToDecimalArray(txt));
    } else {
      cmd = cmd.concat(this.Impresora.stringToDecimalArray(txt));
    }
    const result = await this.Impresora.SendCmd(cmd);
    console.log('🚀 ~ file: NoFiscalDoc.js ~ line 50 ~ Bold ~ result', result);
  },
  //Efecto expandido
  Expanded: async function (txt) {
    await this.Normal(txt);
  },
  // Efecto negrita + centrado + doble ancho
  BoldCenterDouble: async function (txt) {
    var cmd = [];
    cmd.push(TEXTO_DOC_NO_FF);
    cmd.push(SEP);
    let NewMask = mask240; //240
    NewMask = NewMask | FLAG_B;
    NewMask = NewMask | FLAG_A; //BOLD
    if (NewMask > 240) {
      cmd.push(NewMask);
      cmd = cmd.concat(this.Impresora.stringToDecimalArray(txt));
    } else {
      cmd = cmd.concat(this.Impresora.stringToDecimalArray(txt));
    }
    const result = await this.Impresora.SendCmd(cmd);
    console.log('🚀 ~ file: NoFiscalDoc.js ~ line 50 ~ Bold ~ result', result);
  },
  //Efecto centrado
  Normal: async function (txt) {
    var cmd = [];
    cmd.push(TEXTO_DOC_NO_FF);
    cmd.push(SEP);
    let NewMask = mask240; //240
    //if (CenterKeywords) NewMask = NewMask | FLAG_B;
    if (NewMask > 240) {
      cmd.push(NewMask);
      cmd = cmd.concat(this.Impresora.stringToDecimalArray(txt));
    } else {
      cmd = cmd.concat(this.Impresora.stringToDecimalArray(txt));
    }
    const result = await this.Impresora.SendCmd(cmd);
  },
  Center: async function (txt) {
    var cmd = [];
    cmd.push(TEXTO_DOC_NO_FF);
    cmd.push(SEP);
    let NewMask = mask240; //240
    NewMask = NewMask | FLAG_B; //CENTER
    //NewMask = NewMask | FLAG_A; //BOLD
    if (NewMask > 240) {
      cmd.push(NewMask);
      cmd = cmd.concat(this.Impresora.stringToDecimalArray(txt));
    } else {
      cmd = cmd.concat(this.Impresora.stringToDecimalArray(txt));
    }
    const result = await this.Impresora.SendCmd(cmd);
    console.log('🚀 ~ file: NoFiscalDoc.js ~ line 50 ~ Bold ~ result', result);
  },
  //Efecto negrita + centrado
  BoldCenter: async function (txt) {
    var cmd = [];
    cmd.push(TEXTO_DOC_NO_FF);
    cmd.push(SEP);
    let NewMask = mask240; //240
    NewMask = NewMask | FLAG_B; //CENTER
    NewMask = NewMask | FLAG_A; //BOLD
    if (NewMask > 240) {
      cmd.push(NewMask);
      cmd = cmd.concat(this.Impresora.stringToDecimalArray(txt));
    } else {
      cmd = cmd.concat(this.Impresora.stringToDecimalArray(txt));
    }
    const result = await this.Impresora.SendCmd(cmd);
    console.log('🚀 ~ file: NoFiscalDoc.js ~ line 50 ~ Bold ~ result', result);
  },
  Close: async function (txt = null) {
    if (txt) await this.Bold(txt);

    var cmd = [];
    cmd.push(CERRAR_DOC_NO_FF);
    cmd.push(SEP);
    const result = await this.Impresora.SendCmd(cmd);
  },
};
module.exports = NoFiscalDoc;
