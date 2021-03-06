var crypto = require("./crypto.js")
var constants = require("../constants.js")
var slots = require("../time/slots.js")
var options = require('../options')

function createDelegate(username, secret, secondSecret) {
	var keys = crypto.getKeys(secret);

	var transaction = {
		type: 2,
		amount: 0,
		fee: constants.fees.delegate,
		recipientId: '',
		senderPublicKey: keys.publicKey,
		timestamp: slots.getTime() - options.get('clientDriftSeconds'),
		asset: {
			delegate: {
				username: username,
				publicKey: keys.publicKey
			}
		}
	};

	crypto.sign(transaction, keys);

	if (secondSecret) {
		var secondKeys = crypto.getKeys(secondSecret);
		crypto.secondSign(transaction, secondKeys);
	}

	transaction.id = crypto.getId(transaction);
	return transaction;
}

module.exports = {
	createDelegate: createDelegate
}
