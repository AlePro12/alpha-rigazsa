/**
 * INTEGRACION DE API DE IMPRESORA FISCAL CON NODEJS PARA IMPRESORAS RIGAZSA
 */
const { SerialPort } = require("serialport");

//const Readline = require('@serialport/parser-readline');
const vars = require("./vars");
const rigazsa = {
  portType: "serial",
  secuenceLine: FIRST_SEQ,
  openPort: null,
  retry: 2,
  bandera: false,
  SerialNumber: "",
  debug: true,
  flags: [],
  RIF: "",
  SubtotalSales: 0,
  port: "",
  config: {
    CONF_RIF: "",
    CONF_SERIAL: "",
    IVA_R: "8,00",
    IVA_G: "16,00",
    IVA_A: "31,00",
    IVA_P: "0,00",
    MODE_HOUR: "S",
    DHCPCHECK: "S",
    SSID_WIFI: "",
    URL: "",
    INTERVALOZ: 60,
    MAC: "",
    GATEWAY: "0.0.0.0",
    PRIMARYDNS: "0.0.0.0",
    SECONDARYDNS: "0.0.0.0",
    SUCURSALES: "",
    IPADDRESS: "0.0.0.0",
    NETSUBMASK: "0.0.0.0",
    FECHA: "",
    HORA: "",
    MIN: "",
    TRAINING: false,
  },
  init: async function (port, portType = "serial") {
    this.portType = portType;
    if (!port) throw new Error("Puerto serial no definido");
    console.log("ALPHA-RIGAZSA: init PORT:", port);
    if (this.bandera) throw new Error("Impresora ya inicializada");
    if (portType === "serial") {
      //const openPort = await ControllerSerialPort.OpenSerialPort(port, null);

      this.openPort = await new SerialPort(
        //  '\\\\.\\' + puerto, //Windows
        {
          path: port,
          baudRate: 9600,
          dataBits: 8,
          stopBits: 1,
          autoOpen: false,
        }
      );
      await new Promise((resolve, rejected) => {
        this.openPort.open(function (error) {
          if (error) {
            console.log("Error al abrir el puerto serial");
            rejected(error);
          }
          resolve(true);
        });
      });

      if (!this.openPort) {
        throw new Error("Error al abrir el puerto serial");
        return;
      }
      if (!this.openPort.isOpen) {
        throw new Error("Error al abrir el puerto serial");
        return;
      }
      this.port = port;
      this.bandera = true;

      this.openPort.on("close", function () {
        console.log("puerto cerrado 1");
        this.bandera = false;
      });
      this.openPort.on("error", function (error) {
        console.log("error en el puerto", error);
        this.bandera = false;
      });
    } else if (portType === "network") {
      //se usa rest api
      throw new Error("En desarrollo para impresoras de red");
    } else {
      throw new Error("Tipo de puerto no soportado");
    }
    const info = await this.getInfoPrinter();
    const status = await this.getStatusPrinter();
    const initPrinter = {
      CONF_SERIAL: info.CONF_SERIAL,
      CONF_RIF: info.CONF_RIF,
      ...status,
    };
    this.config = initPrinter;
    this.SerialNumber = initPrinter.CONF_SERIAL;
    this.RIF = initPrinter.CONF_RIF;
    this.SubtotalSales = 0;
    console.log("SerialNumber:", this.SerialNumber);
    console.log("Impresora inicializada!");
  },
  SendCmd: async function (cmd, toStr = true) {
    if (!this.bandera) throw new Error("Impresora no inicializada");
    const sendCmd = await this.Write_Printer(cmd);
    return toStr ? this.bufferToString(sendCmd) : sendCmd;
  },
  getInfoPrinter: async function () {
    var cmd = [];
    cmd.push(ESTADO_FISCALIZACION_IMPRESORA);
    const result = await this.SendCmd(cmd, false);
    let fail = await this.AnalizeResponseBuffer(result);
    if (fail) throw new Error(fail);
    let RifPrinter = this.AnalizeResponseBufferGeneric(result, "4");
    RifPrinter = this.bufferToString(RifPrinter);
    let SerialPrinter = this.AnalizeResponseBufferGeneric(result, "3");
    SerialPrinter = this.bufferToString(SerialPrinter);
    return {
      CONF_SERIAL: SerialPrinter,
      CONF_RIF: RifPrinter,
    };
  },
  getStatusPrinter: async function (print = false) {
    var cmd = [];
    cmd.push(CONSULTA_ESTADO);
    cmd.push(SEP);
    print
      ? cmd.push(CONSULTA_ESTADO_PARAMETRO_PRINT)
      : cmd.push(CONSULTA_ESTADO_PARAMETRO);
    const result = await this.SendCmd(cmd, false);
    let fail = await this.AnalizeResponseBuffer(result);
    if (fail) throw new Error(fail);
    let data = [];
    for (var i = 0; i < 31; i++) {
      let status = await this.AnalizeResponseBufferGeneric(result, "" + i);
      data.push(status);
    }
    return this.parseStatusPrinter(data);
  },
  getAllInfoPrinter: async function () {
    const status = await this.getStatusPrinter(true);
    const info = await this.getInfoPrinter();
    return { ...info, ...status };
  },
  errorHandlerDocCancel: function (status) {},
  Reconnect: async function () {},
  ActParams: async function (params) {},
  parseStatusPrinter: function (status) {
    const statusPrinter = {
      IVA_P: decimal_tax(this.bufferToString(status[10])),
      IVA_R: decimal_tax(this.bufferToString(status[11])),
      IVA_G: decimal_tax(this.bufferToString(status[12])),
      IVA_A: decimal_tax(this.bufferToString(status[13])),
      MODE_HOUR: hex_to_ascii(this.bufferToString(status[5])),
      DHCPCHECK: hex_to_ascii(this.bufferToString(status[18])),
      SSID_WIFI: this.bufferToString(status[7]),
      URL: this.bufferToString(status[8]),
      INTERVALOZ: parseInt(this.bufferToString(status[9]), 16),
      MAC: this.bufferToString(status[16]),
      GATEWAY: this.bufferToString(status[21]),
      PRIMARYDNS: this.bufferToString(status[22]),
      SECONDARYDNS: this.bufferToString(status[23]),
      IPADDRESS: this.bufferToString(status[19]),
      NETSUBMASK: this.bufferToString(status[20]),
      DATE: this.bufferToString(status[27]),
      HOUR: this.bufferToString(status[28]),
      DATEFAIL: this.bufferToString(status[29]),
      HOURFAIL: this.bufferToString(status[30]),
      INPUTMETHOD: hex_to_ascii(this.bufferToString(status[24])) === "W",
      UDPPORT: this.bufferToString(status[26]),
      LASTCOMAND: this.bufferToString(status[3]),
      PAGINATIONMODE: hex_to_ascii(this.bufferToString(status[4])),
      MODEHOUR: hex_to_ascii(this.bufferToString(status[5])) === "S",
      DHCPCLIENT: hex_to_ascii(this.bufferToString(status[18])) === "S",
      LASTZ: this.bufferToString(status[6]),
      SSIDWIFI: this.bufferToString(status[7]),
      URLAPP: this.bufferToString(status[8]),
    };
    return statusPrinter;
  },

  CierreX: async function () {
    var cmd = [];
    cmd.push(Report_Z_X);
    cmd.push(SEP);
    cmd.push(0x53);

    const result = await this.SendCmd(cmd);
    return result;
  },
  CierreX2: async function () {
    return await this.CierreX();
  },
  BorrarAcumulado: async function () {},
  CierreZ: async function () {
    var cmd = [];
    cmd.push(Report_Z_X);
    cmd.push(SEP);
    cmd.push(0x5a);

    const result = await this.SendCmd(cmd);
    return result;
  },
  //PRINTER OPERATIONAL COMMANDS

  /**********************************************************************************
Convierte un buffer en hexadecimal y agrega 0 para haer formato de 2 digitos
tomado de: https://living-sun.com/es/javascript/380118-javascript-arraybuffer-to-hex-javascript.html
***********************************************************************************/
  bufferToHex: function (buffer) {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  },
  /**********************************************************************************
  Funcion: bufferToString
  Convierte un buffer en string
  Recibe: Buffer
  Retorna: Array String
  ***********************************************************************************/
  bufferToString: function (buffer) {
    return Array.from(new Uint8Array(buffer))
      .map((b) => String.fromCharCode(b.toString()))
      .join("");
  },
  /**********************************************************************************
  Convierte un buffer en acii y agrega 0 para haer formato de 2 digitos
  Recibe: Buffer
  Retorna: Array String
  ***********************************************************************************/
  bufferToAscii: function (buffer) {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(10).padStart(2, "0"))
      .join("");
  },
  /******************************************************************************************************
  Esta funcion convierte un String Varchar en su equivalente ascii y adicional lo retorna en forma de Array
  Recibe: String Varchar (Dato ejemplo "Articulo de Prueba")
  Retorna: Array con el equivalente ascii de cada letra del string pasado por parametro
  ********************************************************************************************************/
  stringToDecimalArray: function (string) {
    return Array.from(string).map((b) => b.toString(10).charCodeAt());
  },

  stringTocharArray: function (string) {
    return Array.from(string).map((b) => b.toString(10));
  },

  /**********************************************************************************
  Convierte un buffer en hexadecimal y agrega 0 para haer formato de 2 digitos
  tomado de: https://living-sun.com/es/javascript/380118-javascript-arraybuffer-to-hex-javascript.html
  ***********************************************************************************/
  bufferToBin: function (buffer) {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(2))
      .join("");
  },
  AnalizeResponseBuffer: function (Comando) {
    const BufferReceive = Buffer.from(Comando); //Convierto a Buffer
    let IteradorTrama = 0;
    let StatusImpresora = [];
    let StatusFiscal = [];
    let FlagSep = 0;
    let numSeq = 0;
    let numComando = 0;
    let dato = "";

    BufferReceive.forEach(function (datoReceive) {
      if (datoReceive == SEP) {
        FlagSep++;
      } else {
        FlagSep == 0;
      }
      if (datoReceive == STX) {
        IteradorTrama++;
      }
      if (IteradorTrama == 1 && datoReceive != STX) {
        numSeq = datoReceive;
        IteradorTrama++;
      }
      if (IteradorTrama == 2 && datoReceive != numSeq) {
        IteradorTrama++;
        numComando = datoReceive;
      }
      if (IteradorTrama == 3 && datoReceive != numComando && FlagSep == 1) {
        if (datoReceive != SEP) StatusImpresora.push(datoReceive);
      } else if (FlagSep == 2 && IteradorTrama == 3) {
        const StatusPrinterbuffer = Buffer.from(StatusImpresora); //Convierto a Buffer
        dato = rigazsa.ValidateTramaStatusPrinter(StatusPrinterbuffer);
        IteradorTrama++;
        numComando = datoReceive;
        if (StructErrorModuleFiscalPrinter.bitError) {
          StructErrorModuleFiscalPrinter.errorHex = BufferReceive;
        }
      }
      if (IteradorTrama == 4 && datoReceive != numComando && FlagSep == 2) {
        StatusFiscal.push(datoReceive);
      } else if (
        FlagSep == 3 &&
        IteradorTrama == 4 &&
        StructErrorModuleFiscalPrinter.bitError != true
      ) {
        const StatusFiscalbuffer = Buffer.from(StatusFiscal); //Convierto a Buffer
        dato = rigazsa.ValidateTramaStatusFiscal(StatusFiscalbuffer);
        IteradorTrama++;
        if (StructErrorModuleFiscalPrinter.bitError) {
          StructErrorModuleFiscalPrinter.errorHex = BufferReceive;
        }
      }
    });
  },

  /**************************************************************************
Metodo:AnalizeResponseBufferGeneric
Este metodo retornar el valor de la trama entre 2 SEP,
Recibe: La trama a analizar y el numero de SEP a evaluar
Retorna: El valor de la trama (type buffer) entre el SEP recibido y el siguiente SEP o ETX,
sino se cumple la condicion retorna error
*****************************************************************************/
  AnalizeResponseBufferGeneric: function (Comando, numSEP) {
    let aux = 0;
    const BufferReceive = Comando; //Convierto a Buffer
    let IteradorTrama = 0;
    let TramaReturn = [];
    let FlagSep = 0;
    let numSeq = 0;
    let numComando = 0;
    let dato = "";
    let error = Buffer.from("00", "hex");

    for (let i = 0; i < BufferReceive.length; i++) {
      const datoReceive = BufferReceive[i];
      // BufferReceive.forEach(function (datoReceive) {
      //Incremento la bandera cada vez que consiga un SEP
      if (datoReceive == SEP || datoReceive == ETX) {
        FlagSep++;
      }
      //Inicio la trama
      if (datoReceive == STX) {
        IteradorTrama++;
      }
      //Verifico la Secuencia
      if (IteradorTrama == 1 && datoReceive != STX) {
        numSeq = datoReceive;
        IteradorTrama++;
      }
      //Averiguo el comando ejecutado
      if (IteradorTrama == 2 && datoReceive != numSeq) {
        IteradorTrama++;
        numComando = datoReceive;
      }
      if (FlagSep == numSEP) {
        if (datoReceive != SEP)
          if (!(datoReceive >= 189)) {
            TramaReturn.push(datoReceive);
            //if (!(aux > 4)) console.log(datoReceive);
            aux++;
          }
      }
      if (FlagSep > numSEP) return TramaReturn;
      //Si nunca se cumple pero la trama es ETX
      if (datoReceive == ETX) return error;
    }
  },

  ValidateTramaStatusFiscal: function (BufferReceive) {
    let inte = parseInt(BufferReceive, 16);
    let title = "ATENCION:";
    if (inte & estado_MF.ORLogico.valorBit) {
      if (inte & estado_MF.ComproMF.valorBit) {
        console.log(estado_MF.ComproMF.Mensaje);
        StructErrorModuleFiscalPrinter.mensaje = estado_MF.ComproMF.Mensaje;
      }
      if (inte & estado_MF.ComproMT.valorBit) {
        console.log(estado_MF.ComproMT.Mensaje);
        StructErrorModuleFiscalPrinter.mensaje = estado_MF.ComproMT.Mensaje;
      }
      if (inte & estado_MF.ComproMA.valorBit) {
        console.log(estado_MF.ComproMA.Mensaje);
        StructErrorModuleFiscalPrinter.mensaje = estado_MF.ComproMA.Mensaje;
      }
      if (inte & estado_MF.ComNoReconocido.valorBit) {
        console.log(estado_MF.ComNoReconocido.Mensaje);
        StructErrorModuleFiscalPrinter.mensaje =
          estado_MF.ComNoReconocido.Mensaje;
      }
      if (inte & estado_MF.DatosInvalido.valorBit) {
        console.log(estado_MF.DatosInvalido.Mensaje);
        StructErrorModuleFiscalPrinter.mensaje =
          estado_MF.DatosInvalido.Mensaje;
      }
      if (inte & estado_MF.ComandoNoValido.valorBit) {
        console.log(estado_MF.ComandoNoValido.Mensaje);
        StructErrorModuleFiscalPrinter.mensaje =
          estado_MF.ComandoNoValido.Mensaje;
      }
      if (inte & estado_MF.DesbordeTotales.valorBit) {
        console.log(estado_MF.DesbordeTotales.Mensaje);
        StructErrorModuleFiscalPrinter.mensaje =
          estado_MF.DesbordeTotales.Mensaje;
      }
      if (inte & estado_MF.MFLlena.valorBit) {
        console.log(estado_MF.MFLlena.Mensaje);
        StructErrorModuleFiscalPrinter.mensaje = estado_MF.MFLlena.Mensaje;
      }
      if (inte & estado_MF.ComproRTC.valorBit) {
        console.log(estado_MF.ComproRTC.Mensaje);
        StructErrorModuleFiscalPrinter.mensaje = estado_MF.ComproRTC.Mensaje;
      }
      if (inte & estado_MF.MALlena.valorBit) {
        console.log(estado_MF.MALlena.Mensaje);
        StructErrorModuleFiscalPrinter.mensaje = estado_MF.MALlena.Mensaje;
      }
      if (inte & estado_MF.NecesarioZ.valorBit) {
        console.log(estado_MF.NecesarioZ.Mensaje);
        StructErrorModuleFiscalPrinter.mensaje = estado_MF.NecesarioZ.Mensaje;
      }

      StructErrorModuleFiscalPrinter.bitError = true;
      return error; //Error porque el OrLogico quedo activo
    } else {
      //Fin OR_Logico
      if (inte & estado_MF.MFCasiLlena.valorBit) {
        new ControllerCommandFiscalPrinter.PrintMSGSGeneric(
          estado_MF.MFCasiLlena.Mensaje,
          TypeWarning,
          title
        );
        StructErrorModuleFiscalPrinter.mensaje =
          estado_MF.FactFiscalAbierta.Mensaje;
      }

      if (inte & estado_MF.Bit15.valorBit) {
        console.log("Mensaje de Error:", estado_MF.Bit15.Mensaje);
        StructErrorModuleFiscalPrinter.mensaje = estado_MF.Bit15.Mensaje;
      }
      StructErrorModuleFiscalPrinter.bitError = false;
      return success;
    }
  },

  Write_Printer: async function (cmd) {
    return new Promise(async (resolve, rejected) => {
      console.log("Comando:", cmd);
      var bcc, arr, buf;
      let ComandoFinal = this.ConstructTramaLast(cmd); //Construye la Trama Final
      console.log("ComandoFinal:", ComandoFinal);
      bcc = await new this.Calculate_BCC(ComandoFinal);
      const bccbuffer = Buffer.from(bcc);
      const bcccomand = Buffer.from(ComandoFinal);
      arr = [bcccomand, new Uint8Array(bcc)];
      buf = Buffer.concat(arr);
      var ErrorTimeOut = false;
      if (this.portType === "serial") {
        let dato = await this.WriteSerialPortSetTimeOut(
          buf,
          TimeAwaitResponsePrinter
        );
        resolve(dato);
      } else {
        let UDP = null; // require('./ControllerUDP.js');
        UDP_BUFFER = new UDP.UDPResponds("", function () {
          ErrorTimeOut ? callback(error) : callback(UDP_BUFFER.GetValue());
        });
        escribirUDP = new Promise((resolve2, rejected2) => {
          UDP.EnviarTrama(buf);
          resolve2(true);
          resolve(true);
        }).catch((e) => {
          //callback(error);
          rejected(e);
          console.log(`Error:${e}`);
        });
      }
    });
  },

  WriteSerialPortSetTimeOut: function (escritura, milisegundos) {
    var isClosing = false;
    if (this.openPort) {
      if (this.openPort.isOpen) {
        return new Promise(async (resolve, reject) => {
          let FlagIntoResponsePrinter = false;
          const hexParts = [];
          let data = await new Promise((resolve2, rejected2) => {
            const port = this.openPort;
            port.write(escritura, function (err, res) {
              if (err) {
                console.log("Error al escribir en el puerto");
                rejected2(err);
              }
              port.on("data", (data) => {
                FlagIntoResponsePrinter = true;
                var buf = Buffer.concat([data]);
                hexParts.push(buf);
                let cont = 0;
                data.forEach(function (a) {
                  if (a == ETX) {
                    //si consigo el ETX
                    resolve2(Bufferjoin(hexParts, ""));
                  }
                });
              });
              setTimeout(() => {
                if (!FlagIntoResponsePrinter) {
                  console.log("Error: se acabó el tiempo");
                  reject2(error);
                }
              }, milisegundos);
            });
          });
          resolve(data);
        });
      } else {
        //Si el puerto esta cerrado EJ que apaguen la impresora
        return new Promise((resolve) => {
          console.log("El puerto esta cerrado");
          //Empieza TimeOut
          setTimeout(() => {
            resolve(error); //Si no escribe
          }, milisegundos);
        });
      } //Fin del else del si puerto isOpen
    } else {
      //Fin del if de si existe la bandera puertoGeneral
      return new Promise((resolve) => {
        console.log("No existe this.openPort");
        //Empieza TimeOut
        setTimeout(() => {
          resolve(error); //Si no escribe
        }, milisegundos);
      });
    }
  },

  ValidateTramaStatusPrinter: function (BufferReceive) {
    let inte = parseInt(BufferReceive, 16);
    if (inte & estado_Impresora.ORLogico.valorBit) {
      if (inte & estado_Impresora.uiTapaAbierta.valorBit) {
        console.log(estado_Impresora.uiTapaAbierta.Mensaje);

        StructErrorModuleFiscalPrinter.mensaje =
          estado_Impresora.uiTapaAbierta.Mensaje;
      }
      if (inte & estado_Impresora.uiFallaImpresora.valorBit) {
        console.log(estado_Impresora.uiFallaImpresora.Mensaje);

        StructErrorModuleFiscalPrinter.mensaje =
          estado_Impresora.uiFallaImpresora.Mensaje;
      }
      if (inte & estado_Impresora.uiImpresoraOffLine.valorBit) {
        return console.log(estado_Impresora.uiImpresoraOffLine.Mensaje);
        StructErrorModuleFiscalPrinter.mensaje =
          estado_Impresora.uiImpresoraOffLine.Mensaje;
      }
      if (inte & estado_Impresora.uiImprSinPapel.valorBit) {
        return console.log(estado_Impresora.uiImprSinPapel.Mensaje);
        StructErrorModuleFiscalPrinter.mensaje =
          estado_Impresora.uiImprSinPapel.Mensaje;
      }
      StructErrorModuleFiscalPrinter.bitError = true;
      return error;
    } else {
      StructErrorModuleFiscalPrinter.bitError = false;
      StructErrorModuleFiscalPrinter.mensaje = ""; //Inicializo
      return success;
    }
  },

  /*******************************************************************************************************************
FUNCIONES CREADA PARA NUEVO METODO DE ASINCRONISMO DESDE LECTURA COMPLETA DE BUFFER CON DATOS
*******************************************************************************************************************/
  ConstructTramaLast: function (Comando) {
    this.secuenceLine++; //Incremento la secuencia
    if (this.secuenceLine == LAST_SEQ) this.secuenceLine = FIRST_SEQ;
    var ComandoFinal = [];
    //Relleno el Array
    ComandoFinal.push(STX);
    //console.log("SecuenceLine:", this.secuenceLine);
    ComandoFinal.push(this.secuenceLine);
    ComandoFinal = ComandoFinal.concat(Comando);
    ComandoFinal.push(ETX);
    return ComandoFinal;
  },

  /********************************************************************************************************
calcula el BCC
Recibe: Un array con todos los comandos
Retorna: El BCC (block check character) Rellenado de 0
*********************************************************************************************************/
  Calculate_BCC: function (ComandoFinal) {
    var bcc = 0;
    const hexParts = [];
    for (var i = 0; i < ComandoFinal.length; i++) {
      var hexint = ComandoFinal[i];
      bcc = hexint + bcc;
    }
    //console.log("Valor BCC:"+bcc);
    //Convierto bcc a hexa
    bcc = bcc.toString(16);
    //console.log("Valor BCC:"+bcc);
    bcc = bcc.toUpperCase();
    //Relleno de 0 a la izquierda el string completo
    bcc = bcc.lpad("0", 4);
    //console.log("Valor BCC:"+bcc);
    //Leere caracter a caracter y lo convertire en un buffer (matriz)
    for (var i = 0; i < 4; i++) {
      //console.log(bcc[i].charCodeAt());
      hexParts.push(bcc[i].charCodeAt());
      //hexParts.push("0x"+bcc[i]);
    }
    //Envio el BCC
    return hexParts;
  },
};

function Bufferjoin(array, insert) {
  if (array.length === 0)
    throw new TypeError("first argument must be an array of Buffers");
  if (array.length === 1) return Buffer.concat(array);

  const len = array.length * (insert ? 2 : 1);
  const minusLastOrNot = insert ? 1 : 0;
  let arr = new Array(len - minusLastOrNot);
  let i = 0;
  let j = 0;

  while (i < len) {
    arr[i] = array[j];
    j++;
    i++;
    if (i == len - minusLastOrNot) break;
    if (insert) {
      arr[i] = insert;
      i++;
    }
  }

  return Buffer.concat(arr);
}

function CHR(ord) {
  return String.fromCharCode(ord);
}
function decimal_tax(tax) {
  if (tax) {
    tax = tax / 100 + ",00";
  }
  return tax;
}
function hex_to_ascii(str1) {
  var hex = str1.toString();
  var str = "";
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}
/**************************************************************************************************
Funcion creada para rellenar de 0 a la izquierda
Recibe: valor con el que se desea rellenar || campos a rellenar
***************************************************************************************************/
String.prototype.lpad = function (padString, length) {
  var str = this;
  while (str.length < length) str = padString + str;
  return str;
};
module.exports = rigazsa;
