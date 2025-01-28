import React, { useState, useContext } from "react";
import Feed_Header from "./feed_header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlassMartini, faUserGear } from "@fortawesome/free-solid-svg-icons";
import AccountContext from "../../Context/AccountContext";

function Settings() {
  const [attribute, setAttribute] = useState("");
  const [attribute_value, setAttribute_value] = useState("");
  const [current_value, setCurrentValue] = useState(""); // State for current value
  const { updateUser, fetchAttributeValue, getSession } = useContext(AccountContext);

  // Fetch current value from Cognito
  const handleAttributeChange = async (event) => {
    const selectedAttribute = event.target.value;
    setAttribute(selectedAttribute);

    if (selectedAttribute) {
      try {
        const value = await fetchAttributeValue(selectedAttribute);
        setCurrentValue(value || "Not Set");
      } catch (err) {
        console.error("Error fetching attribute:", err);
        setCurrentValue("Error fetching value");
      }
    } else {
      setCurrentValue("");
    }
  };

  // Update attribute value
  const handleUpdate = (event) => {
    event.preventDefault();
    if (!attribute) {
      alert("Please select an attribute before updating.");
      return;
    }
    if (!attribute_value) {
      alert("Please enter a new value to update.");
      return;
    }

    getSession()
      .then((session) => {
        const email = session.email;
        updateUser(email, attribute, attribute_value)
          .then((data) => {
            alert("Data changed successful");
            console.log("success", data);
           
            alert("Attribute updated successfully!");
            setCurrentValue(attribute_value); // Update current value on success
          })
          .catch((err) => {
            console.log("fail", err.message);
            alert("Failed to update attribute. Please try again.");
          });
      })
      .catch((err) => {
        console.log("Error fetching session:", err);
        alert("Failed to fetch session. Please try again.");
      });
  };

  return (
    <>
      <Feed_Header />

      <div className="container mt-4">
        <h1 className="main_label text-center mb-4">
          Settings <FontAwesomeIcon icon={faUserGear} />
        </h1>

        <div className="row">
          {/* Main Form */}
          <div className="col-md-8">
            <div className="settings card p-4 bg-dark">
              <div className="mb-3">
                <label htmlFor="attribute-select" className="form-label">
                  Select Attribute <FontAwesomeIcon icon={faGlassMartini} />
                </label>
                <select
                  id="attribute-select"
                  value={attribute}
                  onChange={handleAttributeChange}
                  className="form-select"
                >
                  <option value="">Select Attribute</option>
                  <option value="name">Name</option>
                  <option value="phone_number">Phone Number</option>
                  <option value="address">Address</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="new-value" className="form-label">
                  Enter New Value
                </label>
                <input
                  id="new-value"
                  type="text"
                  value={attribute_value}
                  onChange={(event) => setAttribute_value(event.target.value)}
                  placeholder="New Value"
                  className="form-control"
                />
              </div>

              <div className="d-grid">
                <button onClick={handleUpdate} className="btn btn-primary">
                  Update
                </button>
              </div>
            </div>
          </div>

          {/* Current Value Section */}
          <div className="col-md-4">
            <div className="card p-4 bg-dark">
              <h5 className="card-title">Current Value</h5>
              <p className="card-text">
                {current_value || "Select an attribute to see its value."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
