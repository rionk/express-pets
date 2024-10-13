const {ObjectId} = require('mongodb')
const client = require('../db')
const sanitizeHtml = require('sanitize-html')

const sanitizeOptions = {
	allowedTags: [],
	allowedAttributes: {}
}
const petCollection = client.db().collection('pets')
const contactCollection = client.db().collection('contacts')

exports.submitContact = async (req, res) => {
	let {id, name, email, secret, comment} = req.body;

	if(!ObjectId.isValid(id)){
		return res.json({message: "Invalid id"})
	}

	const doesPetExist = await petCollection.findOne({_id: new ObjectId(id)})

	if (!doesPetExist) {
		return res.json({message: "Pet does not exist"})
	}

	if(typeof name !== 'string') {
		name = ""
	}
	if (typeof email !== 'string') {
		email = ""
	}
	if (typeof comment !== 'string') {
		comment = ""
	}

	const contactData = {
		petId : new ObjectId(id),
		name: sanitizeHtml(name, sanitizeOptions),
		email: sanitizeHtml(email, sanitizeOptions),
		comment: sanitizeHtml(comment, sanitizeOptions)
	}
	const response = await contactCollection.insertOne(contactData)

	res.json("Thanks for sending data for us")
}

exports.viewPetContact = async (req, res, next) => {
	const id = req.params.id

	if(!ObjectId.isValid(id)){
		console.log("Invalid id")
		return res.redirect("/admin")
	}

	const pet = await petCollection.findOne({
		"_id": new ObjectId(id)
	})

	if (!pet) {
		console.log("Pet does not exist")
		return res.redirect("/admin")
	}

	const contacts = await contactCollection.find({
		"petId" : new ObjectId(id)
	}).toArray()

	console.log('contacts', contacts)

	res.render("pet-contacts", {
		contacts, pet
	})
}