const db = require("../models");
const Phones = db.phones;
const Contacts = db.contacts; // Import the Contacts model for validation
const Op = db.Sequelize.Op;

// Create a phone
exports.create = (req, res) => {
    // Validate request
    if (!req.body.phoneType || !req.body.phoneNumber || !req.body.contactId) {
        return res.status(400).send({
            message: "Phone type, phone number, and contact ID are required"
        });
    }

    // Create a Phone object
    const phone = {
        phoneType: req.body.phoneType,
        phoneNumber: req.body.phoneNumber,
        contactId: req.body.contactId
    };

    // Save the Phone in the database
    Phones.create(phone)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the phone."
            });
        });
};

// Get all phones
exports.findAll = (req, res) => {
    Phones.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred"
            });
        });
};

// Get one phone by id
exports.findOne = (req, res) => {
    const id = req.params.phoneId;

    Phones.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Phone with id ${id} not found`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || `Error retrieving phone with id ${id}`
            });
        });
};

// Update one phone by id
exports.update = (req, res) => {
    const contactId = req.params.contactId;
    const phoneId = req.params.phoneId;

    Phones.update(req.body, {
        where: { contactId: contactId, id: phoneId}
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Phone was updated successfully."
                });
            } else {
                res.status(404).send({
                    message: `Phone with id ${phoneId} not found`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || `Error updating phone with id ${phoneId}`
            });
        });
};

// Delete one phone by id
exports.delete = (req, res) => {
    const contactId = req.params.contactId;
    const phoneId = req.params.phoneId;

    Phones.destroy({
        where: { contactId: contactId, id: phoneId}
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Phone was deleted successfully."
                });
            } else {
                res.status(404).send({
                    message: `Phone with id ${phoneId} not found`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || `Error deleting phone with id ${phoneId}`
            });
        });
};
