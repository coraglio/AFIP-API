const path = require("path");

process.env.TZ = "utc";
process.env.PORT = "5000";
process.env.AFIP_URL_WSAA =
	"https://wsaahomo.afip.gov.ar/ws/services/LoginCms?wsdl";
process.env.AFIP_URL_SERVICE =
	"https://wswhomo.afip.gov.ar/{service}/service.asmx?wsdl"; //wsfev1
process.env.PRIVATE_KEY = path.resolve(__dirname, "./keys/AFIPtest1");
process.env.PUBLIC_KEY = path.resolve(__dirname, "./keys/AFIPtest1CSR.pem");
process.env.DB_STRING = "mongodb://localhost/afip-api";
