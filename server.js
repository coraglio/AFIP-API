if (process.env.NODE_ENV == "production") {
	require("./setenv.prod.js");
	console.log("Entorno de producción");
} else {
	require("./setenv.js");
	console.log("Entorno de testing");
}

const restana = require("restana"),
	index = require("./routes/index");

(async function () {
	// Lets create Restana
	// This is the HTTP Version check next links to upgrde to HTTPS or even HTTP/2
	// HTTPS: https://github.com/jkyberneees/ana/blob/master/demos/https-service.js
	// HTTP/2: https://github.com/jkyberneees/ana/blob/master/demos/http2-service.js
	const app = restana();

	// Start Routes
	index(app, false);

	await app.start(process.env.PORT || 5000);

	console.log(
		"AFIP API Corriendo en el puerto " + (process.env.PORT || 5000)
	);
})();
