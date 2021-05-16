const fs = require("fs"),
	soap = require("soap"),
	moment = require("moment"),
	xml2js = require("xml2js"),
	parseString = xml2js.parseString,
	ntpClient = require("ntp-client"),
	SignHelper = require("./SignHelper"),
	Cache = require("../cache");

class Tokens {
	constructor() {
		this.privateKey = fs.readFileSync(process.env.PRIVATE_KEY, "utf8");
		this.publicKey = fs.readFileSync(process.env.PUBLIC_KEY, "utf8");

		this.client = false;

		this.cache = new Cache("tokens");
	}

	createClient() {
		return new Promise((resolve, reject) => {
			if (this.client) {
				resolve(this.client);
			} else {
				soap.createClient(process.env.AFIP_URL_WSAA, (err, client) => {
					if (err && !client) {
						reject();
					} else {
						this.client = client;

						resolve(this.client);
					}
				});
			}
		});
	}

	async isExpired(service) {
		try {
			const cachedService = await this.cache.getItem(service);
			if (cachedService && cachedService.date) {
				var hours =
					Math.abs(new Date() - cachedService.date) /
					(1000 * 60 * 60);

				return hours > 12;
			} else {
				return true;
			}
		} catch (e) {
			console.error(e);
			return true;
		}
	}

	getCurrentTime() {
		return new Promise((resolve, reject) => {
			ntpClient.getNetworkTime(
				"time.afip.gov.ar",
				123,
				function (err, date) {
					if (err) {
						reject(err);
					} else {
						console.log("Current time: ", date);
						resolve(date);
					}
				}
			);
		});
	}

	openssl_pkcs7_sign(data, callback) {
		SignHelper.sign({
			content: data,
			key: process.env.PRIVATE_KEY,
			cert: process.env.PUBLIC_KEY,
		})
			.catch(function (err) {
				callback(err);
			})
			.then(function (result) {
				callback(null, result);
			});
	}

	encryptXML(xml) {
		return new Promise((resolve) => {
			this.openssl_pkcs7_sign(xml, (err, enc) => {
				resolve(enc);
			});
		});
	}

	parseXML(data) {
		return new Promise((resolve, reject) => {
			parseString(
				data,
				{
					normalizeTags: true,
					normalize: true,
					explicitArray: false,
					attrkey: "header",
					tagNameProcessors: [
						(key) => {
							return key.replace("soapenv:", "");
						},
					],
				},
				(err, res) => {
					if (err) reject(err);
					else resolve(res);
				}
			);
		});
	}

	formatDate(date) {
		return moment(date).format().replace("-03:00", "");
	}

	generateCMS(service) {
		return new Promise((resolve, reject) => {
			this.getCurrentTime()
				.then((date) => {
					var tomorrow = moment(date).add(1, "day");

					var xml = `<?xml version="1.0" encoding="UTF-8" ?>
							<loginTicketRequest version="1.0">
								<header>
									<uniqueId>${moment().format("X")}</uniqueId>
									<generationTime>${this.formatDate(date)}</generationTime>
									<expirationTime>${this.formatDate(tomorrow)}</expirationTime>
								</header>
								<service>${service}</service>
							</loginTicketRequest>`;

					xml = xml.trim();

					this.encryptXML(xml).then(resolve).catch(reject);
				})
				.catch((err) => {
					console.log(err);
					reject;
				});
		});
	}

	generateToken(service, refresh = false) {
		// Parse some of the Services
		if (service == "wsfev1") {
			service = "wsfe";
		}

		return new Promise(async (resolve, reject) => {
			let isExpired = await this.isExpired(service);
			if (isExpired || refresh === true) {
				this.createClient()
					.then((client) => {
						this.generateCMS(service)
							.then((data) => {
								client.loginCms(
									{
										in0: data,
									},
									(err, result, raw, soapHeader) => {
										this.parseXML(raw)
											.then((res) => {
												//console.info(res.envelope.body);
												var xml_response =
													res.envelope.body
														.logincmsresponse
														.logincmsreturn;

												if (xml_response) {
													this.parseXML(xml_response)
														.then(async (res) => {
															//console.info(res.loginticketresponse.header);
															var credentials =
																res
																	.loginticketresponse
																	.credentials;

															await this.cache.setItem(
																service,
																{
																	date: new Date(),
																	credentials:
																		credentials,
																}
															);

															resolve(
																credentials
															);
														})
														.catch(reject);
												} else {
													reject(
														res.envelope.body.fault
													);
												}
											})
											.catch(reject);
									}
								);
							})
							.catch((err) => {
								console.log(err);
								reject;
							});
					})
					.catch((err) => {
						console.log(err);
						reject;
					});
			} else {
				let token = await this.cache.getItem(service);
				resolve(token.credentials);
			}
		});
	}
}

module.exports = new Tokens();
