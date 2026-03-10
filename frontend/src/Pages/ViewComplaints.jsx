import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/complaints/my-complaints",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setComplaints(res.data.complaints || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) {
    return <div style={{ padding: "40px" }}>Loading...</div>;
  }

  return (
    <div
      style={{
        padding: "40px",
        minHeight: "100vh",
        background: "linear-gradient(to right, #eef2f3, #dfe9f3)",
      }}
    >
      <h2 style={{ marginBottom: "30px" }}>All Complaints</h2>

      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {complaints.map((complaint) => (
            <div
              key={complaint._id}
              onClick={() => navigate(`/complaint/${complaint._id}`)}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                display: "flex",
                gap: "20px",
                alignItems: "center",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              {/* IMAGE */}
              {complaint.images && complaint.images.length > 0 ? (
                <img
                  src={complaint.images[0]}
                  alt="Complaint"
                  style={{
                    width: "130px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(complaint.images[0]);
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "130px",
                    height: "100px",
                    background: "#eee",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    color: "#999",
                  }}
                >
                  No Image
                </div>
              )}

              {/* CONTENT */}
              <div style={{ flex: 1 }}>
                <h3>{complaint.title}</h3>

                <p style={{ fontSize: "12px", color: "#888", marginTop: "8px" }}>
                    Reported on:{" "}
                    {complaint.created_at
                    ? new Date(complaint.created_at).toLocaleString()
                    : "N/A"}
                </p>

                <span
                  style={{
                    marginTop: "10px",
                    display: "inline-block",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: "bold",
                    background:
                      complaint.status === "resolved"
                        ? "#e6f9ed"
                        : complaint.status === "in_progress"
                        ? "#fff4e5"
                        : "#e6f0ff",
                    color:
                      complaint.status === "resolved"
                        ? "green"
                        : complaint.status === "in_progress"
                        ? "orange"
                        : "blue",
                  }}
                >
                  {complaint.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ZOOM MODAL */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
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
            zIndex: 1000,
          }}
        >
          <img
            src={selectedImage}
            alt="Zoom"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "12px",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ViewComplaints;