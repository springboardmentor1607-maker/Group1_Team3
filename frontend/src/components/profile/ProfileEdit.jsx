import React, { useState } from "react";
import Swal from "sweetalert2";
import API from "../../api/axios.js";

const ProfileEdit = ({ user, editMode, setEditMode }) => {

  

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
    location: user?.location || "",
    bio: user?.bio || "",
  });

  const swalOptions = (icon, title, text) => ({
    icon,
    title,
    text,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveChanges = async () => {
    try {
      console.log("clicked")
      const token = localStorage.getItem("token");

      const {email, ...updateData} = formData;

      const response = await API.patch("/user/edit", updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data.success);

      if (response.data.success) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        Swal.fire(
          swalOptions("success", "Saved", response.data.message)
        );

        setEditMode(false);
      }
    } catch (error) {
      Swal.fire(
        swalOptions("error", "Error", "Failed to update profile.")
      );
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  };

  const labelStyle = {
    fontWeight: "500",
    marginBottom: "5px",
    display: "block",
  };

  const buttonStyle = {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    marginRight: "10px",
  };

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>
        {editMode ? "Edit Profile" : "Personal Details"}
      </h2>

      <div>
        <label style={labelStyle}>Name</label>
        <input
          style={inputStyle}
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={!editMode}
        />
      </div>

      <div>
        <label style={labelStyle}>Email</label>
        <input
          style={{...inputStyle, backgroundColor : "#f3f4f6", cursor : "not-allowed"}}
          name="email"
          value={formData.email}
          // onChange={handleChange}
          disabled 
        />
      </div>

      <div>
        <label style={labelStyle}>Mobile</label>
        <input
          style={inputStyle}
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          disabled={!editMode}
        />
      </div>

      <div>
        <label style={labelStyle}>Location</label>
        <input
          style={inputStyle}
          name="location"
          value={formData.location}
          onChange={handleChange}
          disabled={!editMode}
        />
      </div>

      <div>
        <label style={labelStyle}>Bio</label>
        <textarea
          style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          disabled={!editMode}
        />
      </div>

      {!editMode ? (
        <button
          onClick={() => setEditMode(true)}
          style={{
            ...buttonStyle,
            background: "#4f46e5",
            color: "#fff",
          }}
        >
          Edit
        </button>
      ) : (
        <>
          <button
            onClick={() => setEditMode(false)}
            style={{
              ...buttonStyle,
              background: "#e5e7eb",
            }}
          >
            Cancel
          </button>

          <button
            onClick={saveChanges}
            style={{
              ...buttonStyle,
              background: "#16a34a",
              color: "#fff",
            }}
          >
            Save
          </button>
        </>
      )}
    </div>
  );
};

export default ProfileEdit;
