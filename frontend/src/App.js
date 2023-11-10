import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
    // State variables
    const [contacts, setContacts] = useState([]);
    const [phones, setPhones] = useState([]);
    const [newContactName, setNewContactName] = useState("");
    const [newPhoneType, setNewPhoneType] = useState("");
    const [newPhoneNumber, setNewPhoneNumber] = useState("");

    // Add state to track whether phone numbers are visible for each contact
    const [visiblePhones, setVisiblePhones] = useState({});

    // Define a function to fetch phone data for all contacts
const fetchPhoneData = async () => {
    try {
        const phoneDataPromises = contacts.map((contact) => {
            return fetch(
                `http://localhost:5000/api/contacts/${contact.id}/phones`
            )
            .then((response) => response.json())
            .catch((error) => {
                console.error(`Error fetching phones for contact ${contact.id}: ${error}`);
            });
        });

        const phoneData = await Promise.all(phoneDataPromises);
        setPhones(phoneData);
    } catch (error) {
        console.error("Error fetching phone data:", error);
    }
};



    // Fetch contacts data from your API when the component mounts
    useEffect(() => {
        fetch("http://localhost:5000/api/contacts")
            .then((response) => response.json())
            .then((data) => setContacts(data))
            .catch((error) => console.error("Error fetching contacts:", error));
    }, []);

    // Fetch phone data for each contact when the component mounts or when contacts change
    useEffect(() => {
        const fetchPhoneData = async () => {
            const phoneDataPromises = contacts.map((contact) => {
                return fetch(
                    `http://localhost:5000/api/contacts/${contact.id}/phones`
                ).then((response) => response.json())
                .then((data) => setPhones(data))
            .catch((error) => console.error("Error fetching contacts:", error));
            });
    
            const phoneData = await Promise.all(phoneDataPromises);
            setPhones(phoneData);
        };
    
        fetchPhoneData();
        console.log(phones);
    }, [contacts]);
    



    // Create a new contact
    const handleCreateContact = () => {
        if (newContactName.trim() === "") {
            console.error("Contact name cannot be empty.");
            return;
        }

        // Define the new contact data
        const newContactData = {
            contactName: newContactName,
            phones: [], // Initialize with an empty list of phone numbers
        };

        // Make a POST request to create a new contact
        fetch("http://localhost:5000/api/contacts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newContactData),
        })
            .then((response) => response.json())
            .then((data) => {
                setContacts([...contacts, data]);
                setNewContactName("");
            })
            .catch((error) => console.error("Error creating contact:", error));
    };

    const handleCreatePhoneNumber = (contactId, newPhoneType, newPhoneNumber) => {
        if (newPhoneType.trim() === "" || newPhoneNumber.trim() === "") {
            console.error("Phone type and phone number cannot be empty.");
            return;
        }
    
        // Prepare the data for the new phone number
        const newPhoneData = {
            phoneType: newPhoneType,
            phoneNumber: newPhoneNumber,
            contactId: contactId,
        };
    
        // Make a POST request to create a new phone number for the specified contact
        fetch(`http://localhost:5000/api/contacts/${contactId}/phones`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPhoneData),
        })
            .then((response) => response.json())
            .then((data) => {
                // Assuming the API responds with the newly created phone number data
                // Update the local state with the new phone number
                const updatedContacts = contacts.map((contact) => {
                    if (contact.id === contactId) {
                        const updatedContact = {
                            ...contact,
                            phones: contact.phones
                                ? [...contact.phones, data] // Use the response data
                                : [data],
                        };
                        return updatedContact;
                    }
                    return contact;
                });
    
                // Update the state with the new phone number and clear the input fields
                setContacts(updatedContacts);
                setNewPhoneType("");
                setNewPhoneNumber("");
            })
            .catch((error) => console.error("Error creating phone number:", error));
    };

    // Delete a contact and its associated phone numbers
const handleDeleteContact = (contactId) => {
    // Fetch the associated phone numbers
    fetch(`http://localhost:5000/api/contacts/${contactId}/phones`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch associated phone numbers");
            }
            return response.json();
        })
        .then((phoneNumbers) => {
            // Delete each associated phone number
            const deletePhonePromises = phoneNumbers.map((phone) =>
                fetch(`http://localhost:5000/api/contacts/${contactId}/phones/${phone.id}`, {
                    method: "DELETE",
                })
            );

            return Promise.all(deletePhonePromises);
        })
        .then(() => {
            // After all phone numbers are deleted, delete the contact
            return fetch(`http://localhost:5000/api/contacts/${contactId}`, {
                method: "DELETE",
            });
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to delete contact");
            }
            return response.json();
        })
        .then(() => {
            // Filter out the deleted contact
            const updatedContacts = contacts.filter(
                (contact) => contact.id !== contactId
            );
            setContacts(updatedContacts);

            // Now, fetch phone data again to refresh the phone list
            fetchPhoneData();
        })
        .catch((error) => console.error("Error deleting contact and associated phone numbers:", error));
};

 


    // Delete a phone number for a contact
    const handleDeletePhoneNumber = (contactId, phoneNumberId) => {
        fetch(
            `http://localhost:5000/api/contacts/${contactId}/phones/${phoneNumberId}`,
            {
                method: "DELETE",
            }
        )
            .then((response) => response.json())
            .then(() => {
                const updatedContacts = contacts.map((contact) => {
                    if (contact.id === contactId) {
                        return {
                            ...contact,
                            phones: contact.phones.filter(
                                (phone) => phone.id !== phoneNumberId
                            ),
                        };
                    }
                    return contact;
                });

                // Update the state after deleting the phone number
                setContacts(updatedContacts);
            })
            .catch((error) =>
                console.error("Error deleting phone number:", error)
            );
    };

    // Toggle the visibility of phone numbers for a specific contact
    const togglePhoneVisibility = (contactId) => {
        setVisiblePhones((prevState) => ({
            ...prevState,
            [contactId]: !prevState[contactId],
        }));
    };

    return (
        <div className="App">
            <div className="center-content">
                <h1>Contactor</h1>

                <div className="contacts-container">
                    <h2 className="contacts-heading">Contacts</h2>
                    <p>Click on a contact name to view phone numbers.</p>
                    <div className="add-contact">
                        <div className="add-contact-form">
                            <input
                                type="text"
                                value={newContactName}
                                onChange={(e) =>
                                    setNewContactName(e.target.value)
                                }
                                placeholder="Name"
                                className="input-field"
                            />
                            <button
                                onClick={handleCreateContact}
                                className="button"
                            >
                                Create Contact
                            </button>
                        </div>
                    </div>
                    <ul className="contact-list">
                        {contacts.length > 0 ? (
                            contacts.map((contact) => (
                                <li key={contact.id} className="contact-item">
                                    <div className="contact-header">
                                        <h3
                                            onClick={() =>
                                                togglePhoneVisibility(contact.id)
                                            }
                                        >
                                            {contact.contactName}
                                        </h3>
                                        <button
                                            onClick={() =>
                                                handleDeleteContact(contact.id)
                                            }
                                            className="delete-button"
                                        >
                                            Delete Contact
                                        </button>
                                    </div>
                                    {visiblePhones[contact.id] && (
                                        <div className="phone-details">
                                            <h4>Phone Numbers</h4>
                                            <table className="phone-number-table">
                                                <thead>
                                                    <tr>
                                                        <th>Type</th>
                                                        <th>Number</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {contact.phones &&
                                                    contact.phones.length > 0 ? (
                                                        contact.phones.map(
                                                            (phone) => (
                                                                <tr
                                                                    key={phone.id}
                                                                    className="phone-number-row"
                                                                >
                                                                    <td>
                                                                        {
                                                                            phone.phoneType
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            phone.phoneNumber
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        <button
                                                                            onClick={() =>
                                                                                handleDeletePhoneNumber(
                                                                                    contact.id,
                                                                                    phone.id
                                                                                )
                                                                            }
                                                                            className="delete-button"
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="3">
                                                                No phone numbers available.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                            <div className="add-phone-form">
                                                <input
                                                    type="text"
                                                    value={newPhoneType}
                                                    onChange={(e) =>
                                                        setNewPhoneType(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Phone Type (e.g., Mobile, Office)"
                                                    className="input-field"
                                                />
                                                <input
                                                    type="text"
                                                    value={newPhoneNumber}
                                                    onChange={(e) =>
                                                        setNewPhoneNumber(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Phone Number"
                                                    className="input-field"
                                                />
                                                <button
                                                    onClick={() =>
                                                        handleCreatePhoneNumber(
                                                            contact.id,
                                                            newPhoneType,
                                                            newPhoneNumber
                                                        )
                                                    }
                                                    className="button"
                                                >
                                                    Add Phone
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))
                        ) : (
                            <p>No contacts available.</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default App;


