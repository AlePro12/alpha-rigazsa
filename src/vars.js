global.Nota_Credito_MF = 0x44;
global.BANDERA_UDP = false;
global.UDP_PORT = "";
global.UDP_HOST = "";
global.UDP_BUFFER = "";
global.UDP_BUFFER_MANUAL = "";
global.ESTADO_ENTRENAMIENTO = "";
global.UDPDEBUG = true;
global.ABRIR_FF_FLAG = false;
var sBandLoadFrameCommandFiscal = 0;
var sBandLoadFrameAutomatic = 0;
var sBandLoadFrameFiscalizacion = 0;
var sBandLoadFrameConfiguration = 0;
var sBandLoadFrameOthersCommands = 0;
//jlgh 28/01/2020
var sBandLoadFrameFacturasRapidas = 0;
global.TypeSuccess = "success";
global.TypeWarning = "warning";
global.TypeDanger = "danger";
global.TitleApplications = "Programa Homologacion";
global.FlagPrinterInProgress = false;
global.MSGFlagPrinterInProgress =
  "Existe una impresion en progreso, por favor espere.";
global.MSG_GENERIC = "Datos guardados de forma satisfactoria.";
global.MSG_QUERY_GENERIC = "Se van a consultar los datos.";
global.MSG_SUCESS_GENERIC = "Se obtuvieron los datos con éxito.";
global.MSG_ERROR_GENERIC = "No se obtuvieron datos de la impresora.";
global.titleSuccess = "EXITO";
global.titleGeneric = "INFORMACION:";
global.titleError = "ERROR:";
global.SelectedPortPrinterFiscalBandFunction = false;
global.pruebaFlag = false;
global.STX = 0x2;
global.ETX = 0x3;
global.SEP = 0x1c; //28
global.FIRST_SEQ = 0x1f; //31
global.LAST_SEQ = 0x7f; //127
global.IP_NULL = 0x7f; //127
global.SERIAL_PRINTER = 0x80; //128
global.Report_Z = 0x39;
global.Report_Z_X = 0x58;
global.Report_Z_Z = 0x5a;
global.MEMORIA_FISCAL_FECHA = 0x3a;
global.MEMORIA_FISCAL_NUMERO = 0x3b;
global.ABRIR_FF = 0x40; //64
global.TEXTO_FF = 0x41; //65
global.ITEM_FF = 0x42; //65
global.SUB_FF = 0x44; //66
global.PAGO_FF = 0x44; //66
global.BARCODE = 0x46; //70
//global.CERRAR_FF=0x43; // 67
global.CERRAR_FF = 0x45; // 69
//Comandos de Control de la impresora
global.CORTAR_PAPEL_FF = 0x4b; //75
global.AVANCE_PAPEL_FF = 0x4b; //75
//DOCUMENTOS NO FISCALES
global.ABRIR_DOC_NO_FF = 0x48; //72
global.TEXTO_DOC_NO_FF = 0x49; //73
global.CERRAR_DOC_NO_FF = 0x4a; //74
global.Devolucion_MF = 0x44; //68
global.ESPACIO = 0x20; //32
global.Venta_MF = 0x4e; //78
global.error = -1;
global.success = 1;
global.MSG_ImpresoraNoConectada = "IMPRESORA NO CONECTADA";
global.MSG_ImpresoraNoResponde = "IMPRESORA NO RESPONDE.";
global.MSG_Option = "¿Que desea hacer?";
global.SUCCESS = "1";
global.NULO = 0x7f;
global.TimeAwaitResponsePrinter = 3000;
//ESTADOS
global.pristineID = JSON.stringify([48, 48, 48, 48]); //0000
global.pristineID2 = JSON.stringify([49, 48, 48, 48]); //1000
global.ESTADO_FISCALIZACION_IMPRESORA = 0x80;
global.ESTADO_ENVIOS_Z = 0x51;
global.FECHA_Y_HORA_IMPRESORA = 0x59;
global.CONSULTAR_DIRECCION_ESTABLECIMIENTO = 0x4c;
global.CONSULTAR_ENCABEZADO = 0x4e;
global.CONSULTAR_PIE_PAGINA = 0x4f;
global.OBTENER_FIRMWARE_IMPRESORA = 0x17;
global.MODO_PAGINACION = 0x11;
global.CONSULTA_ESTADO = 0x4d; //77
global.CONSULTA_ESTADO_PARAMETRO = 0x4e; //78
global.CONSULTA_ESTADO_PARAMETRO_PRINT = 0x53; //83
global.SETCONFIGURATIONENTERMODE = 0x12;
global.HORA_MILITAR = 0x09;
global.ACCUMESSCONFIGXORZ = 0x13;
global.SETCONFIGURATIONDATEANDHOUR = 0x58;
global.CONFIGURATIONFONTPRINTER = 0x60;
global.CONFIGURATIONWIFI = 0x14;
global.CONFIGURATIONURLAPPREMOTE = 0x15;
global.INTERVAL_TIME_SEND_REPORTSZ = 0x08;
global.GlobalSerialPrinter = "";

global.OBTENER_URL_FIRMWARE = 0x54;
global.OBTENER_FIRMWARE_INTERNO = 0x18;
global.INTERVALTIMESENDZ = "60";
global.CONFIGURATIONSETFLAG = false;

global.CHECKVERSIONFLAG = "";
global.VERSIONMODE = "3";

global.ValueTaxesConfiguration = {
  TaxOne: parseInt(16),
  TaxTwo: parseInt(8),
  TaxThree: parseInt(31),
  TaxFour: parseInt(12),
  TaxExempt: parseInt(0),
};

global.StateInfoPrinterFiscal = {
  SerialImpresora: "",
  RazonSocial: "",
  ImpuestosImpresora: {
    Impuesto_1: "",
    Impuesto_2: "",
    Impuesto_3: "",
    Impuesto_4: "",
  },
  ModoImpresion: "",
  HoraMilitar: "",
};
global.MSG_Estados_Printer = {
  MSGBufferEmpty: "Se vacio el buffer de factura",
  MSGComprFiscOpen: "Ya existe un comprobante fiscal abierto",
  MSGComprFiscClose: "No hay ningun comprobante fiscal abierto",
  MSGComprTextNoFiscalEmpty: "El texto no Fiscal no puede viajar vacio",
};

global.StructErrorModuleFiscalPrinter = {
  mensaje: "Value",
  errorHex: "Hex",
  bitError: false,
};
global.StructConfigurationSizePrinter = {
  error: false,
  maxcaracternormal: 0,
  maxcaracterdouble: 0,
  maxcaracternegrita: 0,
};

global.estado_MF = {
  ComproMF: {
    valorBit: Math.pow(2, 0), //1,
    Mensaje: "Error Comprobación de Memoria Fiscal",
  },
  ComproMT: {
    valorBit: Math.pow(2, 1), //2,
    Mensaje: "Error Comprobación de Memoria Trabajo",
  },
  ComproMA: {
    valorBit: Math.pow(2, 2), //4,
    Mensaje: "Error Comprobación de Memoria Auditora",
  },
  ComNoReconocido: {
    valorBit: Math.pow(2, 3), //8,
    Mensaje: "Comando No Reconocido",
  },
  DatosInvalido: {
    valorBit: Math.pow(2, 4), //16,
    Mensaje: "Campo de Datos Invalidos",
  },
  ComandoNoValido: {
    valorBit: Math.pow(2, 5), //32,
    Mensaje: "Comando No valido para estado fiscal",
  },
  DesbordeTotales: {
    valorBit: Math.pow(2, 6), //64,
    Mensaje: "Desbordamiento de Totales",
  },
  MFLlena: {
    valorBit: Math.pow(2, 7), //128,
    Mensaje: "Memoria Fiscal llena",
  },
  MFCasiLlena: {
    valorBit: Math.pow(2, 8), //256,
    Mensaje: "Memoria Fiscal casi llena",
  },
  ComproRTC: {
    valorBit: Math.pow(2, 9), //512,
    Mensaje: "Error de Comprobación RTC",
  },
  MALlena: {
    valorBit: Math.pow(2, 10), //1024,
    Mensaje: "Memoria Auditora llena",
  },
  NecesarioZ: {
    valorBit: Math.pow(2, 11), //2048,
    Mensaje: "Es Necesario Imprimir Un Z",
  },
  FactFiscalAbierta: {
    valorBit: Math.pow(2, 12), //4096,
    Mensaje: "Factura Fiscal Abierta",
  },
  DNFAbierto: {
    valorBit: Math.pow(2, 13), //8192,
    Mensaje: "Documento No Fiscal Abierto",
  },
  Bit15: {
    valorBit: Math.pow(2, 14), //16384,
    Mensaje: "Impresora en Modo Entrenamiento",
  },
  ORLogico: {
    valorBit: Math.pow(2, 15), //32782,
    Mensaje: "OR LOGICO ACTIVO",
  },
};

global.estado_Impresora = {
  uiBit1: {
    valorBit: Math.pow(2, 0), //1, //Math.pow(2,0)
    Mensaje: "No Definido Bit1",
  },
  uiTapaAbierta: {
    valorBit: Math.pow(2, 1), //2,
    Mensaje: "Tapa de Impresora Abierta",
  },
  uiFallaImpresora: {
    valorBit: Math.pow(2, 2), //4,
    Mensaje: "Falla de Impresora",
  },
  uiImpresoraOffLine: {
    valorBit: Math.pow(2, 3), //8,
    Mensaje: "Impresora Fuera de Linea",
  },
  uiBit5: {
    valorBit: Math.pow(2, 4), //16,
    Mensaje: "No Definido Bit5",
  },
  uiBit6: {
    valorBit: Math.pow(2, 5), //32,
    Mensaje: "No Definido Bit6",
  },
  uiBit7: {
    valorBit: Math.pow(2, 6), //64,
    Mensaje: "No Definido Bit7",
  },
  uiBit8: {
    valorBit: Math.pow(2, 7), //128,
    Mensaje: "No Definido Bit8",
  },
  uiBit9: {
    valorBit: Math.pow(2, 8), //256,
    Mensaje: "No Definido Bit9",
  },
  uiBit10: {
    valorBit: Math.pow(2, 9), //512,
    Mensaje: "No Definido Bit10",
  },
  uiBit11: {
    valorBit: Math.pow(2, 10), //1024,
    Mensaje: "No Definido Bit11",
  },
  uiBit12: {
    valorBit: Math.pow(2, 11), //2048,
    Mensaje: "No Definido Bit12",
  },
  uiBit13: {
    valorBit: Math.pow(2, 12), //4096,
    Mensaje: "No Definido Bit13",
  },
  uiBit14: {
    uiBit5: Math.pow(2, 13), //8192,
    Mensaje: "No Definido Bit14",
  },
  uiImprSinPapel: {
    valorBit: Math.pow(2, 14), //16384,
    Mensaje: "Impresora sin Papel",
  },
  ORLogico: {
    valorBit: Math.pow(2, 15), //32782,
    Mensaje: "OR LOGICO ACTIVO",
  },
};

global.FLAG_A = Math.pow(2, 0); // 00000001
global.FLAG_B = Math.pow(2, 1); // 00000010
global.FLAG_C = Math.pow(2, 2); // 00000100
global.FLAG_D = Math.pow(2, 3); // 00001000
global.FLAG_E = Math.pow(2, 4); // 00010000
global.FLAG_F = Math.pow(2, 5); // 00100000
global.FLAG_G = Math.pow(2, 6); // 01000000
global.FLAG_H = Math.pow(2, 7); // 10000000
global.mask240 = FLAG_E | FLAG_F | FLAG_G | FLAG_H;
global.arrayEstado = [
  [2, 32, 77],
  [48, 48, 48, 48],
  [48, 48, 48, 48],
  [52, 50],
  [52, 69],
  [53, 51],
  [],
  [],
  [],
  [],
  [56, 48, 48],
  [49, 54, 48, 48],
  [51, 49, 48, 48],
  [48],
  [69, 82, 71, 65],
  [66, 115, 32],
  [50, 52, 58, 54, 70, 58, 50, 56, 58, 68, 65, 58, 65, 70, 58, 55, 67],
  [82, 73, 71, 65, 90, 83, 65, 45, 49],
  [53, 51],
  [48, 46, 48, 46, 48, 46, 48],
  [48, 46, 48, 46, 48, 46, 48],
  [48, 46, 48, 46, 48, 46, 48],
  [48, 46, 48, 46, 48, 46, 48],
  [48, 46, 48, 46, 48, 46, 48],
];
