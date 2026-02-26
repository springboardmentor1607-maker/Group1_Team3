import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:5000/api/complaints/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = res.data.complaint || res.data;
        setComplaint(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchComplaint();
  }, [id]);

  if (!complaint) return <p style={{ padding: "40px" }}>Loading...</p>;

  return (
    <div
      style={{
        padding: "40px",
        background: "linear-gradient(to right, #eef2f3, #dfe9f3)",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "auto" }}>
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/complaints",{replace: true})}
          style={{
            marginBottom: "20px",
            padding: "8px 16px",
            background: "#030b33",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <h2>{complaint.title}</h2>

          <p style={{ marginTop: "8px", color: "#555" }}>
            <strong>Reported On:</strong>{" "}
            {complaint.created_at
             ? new Date(complaint.created_at).toLocaleString()
             : "N/A"}
        </p>

        <p style={{ marginTop: "5px", color: "#777", fontSize: "14px" }}>
            <strong>Last Updated:</strong>{" "}
            {complaint.updated_at
            ? new Date(complaint.updated_at).toLocaleString()
            : "N/A"}
        </p>

          <p style={{ marginTop: "15px" }}>
            <strong>Description:</strong> {complaint.description}
          </p>

          {/* IMAGE */}
          {complaint.images && complaint.images.length > 0 ? (
            <>
              <img
                src={complaint.images[0]}
                alt="Complaint"
                style={{
                  width: "350px",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  cursor: "pointer",
                  display: "block",
                  margin: "20px auto",
                  
                }}
                onClick={() => setZoomImage(complaint.images[0])}
              />

              {zoomImage && (
                <div
                  onClick={() => setZoomImage(null)}
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0,0,0,0.85)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={zoomImage}
                    alt="Zoom"
                    style={{
                      maxWidth: "90%",
                      maxHeight: "90%",
                      borderRadius: "12px",
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <p style={{ marginTop: "20px", color: "gray" }}>
              No image uploaded.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;