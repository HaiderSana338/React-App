const db = require("../models");
const Contacts = db.contacts;
const Phones = db.phones;
const Op = db.Sequelize.Op;

// Create contact
exports.create = (req, res) => {
    // Validate request
    if (!req.body.contactName) {
        return res.status(400).send({
            message: "Contact name can't be empty"
        });
    }

    // Create a Contact object
    const contact = {
        contactName: req.body.contactName
    };

    // Save the Contact in the database
    Contacts.create(contact)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the contact."
            });
        });
};

// Get all contacts
exports.findAll = (req, res) => {
    Contacts.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred"
            });
        });
};

// Get one contact by id
exports.findOne = (req, res) => {
    const id = req.params.contactId;

    Contacts.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Contact with id ${id} not found`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || `Error retrieving contact with id ${id}`
            });
        });
};

exports.update = (req, res) => {
    const contactId = req.params.contactId;
    

    Contacts.update(req.body, {
        where: { id: contactId}
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Contact was updated successfully."
                });
            } else {
                res.status(404).send({
                    message: `Contact with id ${contactId} not found`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || `Error updating contact with id ${contactId}`
            });
        });
};

exports.delete = (req, res) => {
    const contactId = req.params.contactId;

    Contacts.destroy({
        where: { id: contactId}
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Contact was deleted successfully."
                });
            } else {
                res.status(404).send({
                    message: `Contact with id ${contactId} not found`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || `Error deleting contact with id ${contactId}`
            });
        });
};

