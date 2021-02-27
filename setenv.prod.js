process.env.TZ = "utc";
process.env.PORT = "5000";
process.env.AFIP_URL_WSAA =
	"https://wsaa.afip.gov.ar/ws/services/LoginCms?wsdl";
process.env.AFIP_URL_SERVICE =
	"https://servicios1.afip.gov.ar/{service}/service.asmx?WSDL"; //wsfev1
process.env.PRIVATE_KEY = path.resolve(__dirname, "./keys/AFIPtest1");
process.env.PUBLIC_KEY = path.resolve(__dirname, "./keys/AFIPtest1CSR.pem");
