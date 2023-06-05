import React, { useState, useEffect } from "react";
import axios from "axios";

const Problem2 = () => {
  const [modalAOpen, setModalAOpen] = useState(false);
  const [modalBOpen, setModalBOpen] = useState(false);
  const [modalCOpen, setModalCOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyEvenChecked, setOnlyEvenChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://contact.mediusware.com/api/contacts/"
      );
      setContacts(response.data.results);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setLoading(false);
    }
  };

  const filterContacts = () => {
    let filtered = contacts;
    if (searchQuery) {
      filtered = filtered.filter((contact) =>
        contact.phone.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (onlyEvenChecked) {
      filtered = filtered.filter((contact) => contact.id % 2 === 0);
    }
    setFilteredContacts(filtered);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    setTimeout(filterContacts, 300); // Delayed filtering to reduce API calls while typing
  };

  const handleCheckboxChange = (e) => {
    setOnlyEvenChecked(e.target.checked);
    filterContacts();
  };

  const openModalA = () => {
    setModalAOpen(true);
    setModalBOpen(false);
    setModalCOpen(false);
  };

  const openModalB = () => {
    setModalAOpen(false);
    setModalBOpen(true);
    setModalCOpen(false);
    filterContactsByCountry("US");
  };

  const openModalC = () => {
    setModalAOpen(false);
    setModalBOpen(false);
    setModalCOpen(true);
  };

  const closeModal = () => {
    setModalAOpen(false);
    setModalBOpen(false);
    setModalCOpen(false);
  };

  const filterContactsByCountry = async (country) => {
    setLoading(true);
    try {
      const response = await axios.get(`/country-contacts/${country}/`);
      setContacts(response.data.results);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <h4 className="text-center text-uppercase mb-5">Problem-2</h4>

        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-lg btn-outline-primary"
            type="button"
            onClick={openModalA}
          >
            All Contacts
          </button>
          <button
            className="btn btn-lg btn-outline-warning"
            type="button"
            onClick={openModalB}
          >
            US Contacts
          </button>
        </div>
      </div>

      {/* Modal A */}
      {modalAOpen && (
        <div className="modal" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modal A</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search contacts"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                  />
                  <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="button">
                      Search
                    </button>
                  </div>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="onlyEvenCheckbox"
                    checked={onlyEvenChecked}
                    onChange={handleCheckboxChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="onlyEvenCheckbox"
                  >
                    Only even
                  </label>
                </div>
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <ul>
                    {filteredContacts.map((contact) => (
                      <li key={contact.id} onClick={openModalC}>
                        {contact.phone}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" type="button">
                  All Contacts
                </button>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={openModalB}
                >
                  US Contacts
                </button>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal B */}
      {modalBOpen && (
        <div className="modal" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modal B</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search contacts"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                  />
                  <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="button">
                      Search
                    </button>
                  </div>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="onlyEvenCheckbox"
                    checked={onlyEvenChecked}
                    onChange={handleCheckboxChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="onlyEvenCheckbox"
                  >
                    Only even
                  </label>
                </div>
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <ul>
                    {filteredContacts.map((contact) => (
                      <li key={contact.id} onClick={openModalC}>
                        {contact.phone}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={openModalA}
                >
                  All Contacts
                </button>
                <button className="btn btn-primary" type="button">
                  US Contacts
                </button>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal C */}
      {modalCOpen && (
        <div className="modal" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modal C</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <ul>
                  <li>Dummy data 1</li>
                  <li>Dummy data 2</li>
                  <li>Dummy data 3</li>
                </ul>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={openModalA}
                >
                  All Contacts
                </button>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={openModalB}
                >
                  US Contacts
                </button>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Problem2;
