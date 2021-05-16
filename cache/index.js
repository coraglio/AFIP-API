const { MongoClient } = require("mongodb");

// Replace the uri string with your MongoDB deployment's connection string.
const uri = process.env.DB_STRING;

const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

var database = null;

async function connect() {
	try {
		await client.connect();

		database = client.db("afip-api");
	} catch (err) {
		// Ensures that the client will close when you finish/error
		console.error(err);
	}
}

class Cache {
	constructor(name) {
		if (!database) {
			connect().then(() => {
				this.collection = database.collection(name);
			});
		}
	}

	async getItem(key) {
		let res = await this.collection.findOne({ key: key });

		return res;
	}

	async setItem(key, value) {
		let res = await this.collection.updateOne(
			{ key: key },
			{ $set: { value: value } },
			{ upsert: true }
		);

		return res;
	}

	async clear() {
		await this.collection.drop();
	}
}

module.exports = Cache;
