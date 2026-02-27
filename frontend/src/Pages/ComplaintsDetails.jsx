import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import { Icon, Style } from "ol/style";
import axios from "axios";

import "./ComplaintDetails.css";

const ComplaintDetails = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);

  /* ------------------ Dummy Status Update (Volunteer) ------------------ */
  const handleStatusChange = (newStatus) => {
    setComplaint((prev) => ({
      ...prev,
      status: newStatus,
    }));
  };

  /* ------------------ Admin Assign ------------------ */
  const handleAssign = async (volunteerId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/admin/assign/${id}`,
        { volunteerId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Volunteer Assigned");
    } catch (error) {
      console.error(error);
    }
  };

  /* ------------------ Fetch Complaint ------------------ */
  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:5000/api/complaints/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
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


  useEffect(() => {
    if (!complaint?.location_coords?.lng || !complaint?.location_coords?.lat)
      return;
  
    const lon = parseFloat(complaint.location_coords.lng);
    const lat = parseFloat(complaint.location_coords.lat);
  
    const mapTarget = document.getElementById("complaintMap");
    if (!mapTarget) return;
  
    const marker = new Feature({
      geometry: new Point(fromLonLat([lon, lat])),
    });
  
    marker.setStyle(
      new Style({
        image: new Icon({
          src: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
          scale: 0.09,
          anchor: [0.5, 1],
        }),
      })
    );
  
    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [marker],
      }),
    });
  
    const map = new Map({
      target: mapTarget,
      layers: [
        new TileLayer({ source: new OSM() }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([lon, lat]),
        zoom: 15,
      }),
    });
  
    return () => {
      map.setTarget(null);
    };
  }, [complaint]);

  if (!complaint) return <div className="cd-loading">Loading...</div>;

  const handleBack = () => {
    if (user?.role === "admin") navigate("/admin-dashboard");
    else if (user?.role === "volunteer") navigate("/volunteer-dashboard");
    else navigate("/complaints");
  };

  return (
    <div className="cd-container">
      <div className="cd-wrapper">

        <button className="cd-back" onClick={handleBack}>
          ← Back
        </button>

        <div className="cd-layout">
          <div className="cd-left">
          <div className="cd-card">
            <h2 className="cd-title">{complaint.title}</h2>

            <div className="cd-meta">
              <span>
                Reported:{" "}
                {complaint.created_at
                  ? new Date(complaint.created_at).toLocaleString()
                  : "N/A"}
              </span>

              <span className={`cd-status ${complaint.status}`}>
                {complaint.status}
              </span>
            </div>



            {/* Image Section */}
            {complaint.images?.length > 0 && (
              <>
                <img
                  src={complaint.images[0]}
                  alt="Complaint"
                  className="cd-image"
                  onClick={() => setZoomImage(complaint.images[0])}
                />

                {zoomImage && (
                  <div
                    className="cd-overlay"
                    onClick={() => setZoomImage(null)}
                  >
                    <img src={zoomImage} alt="Zoom" />
                  </div>
                )}
              </>
            )}

            <p className="cd-address">
              <strong>Address:</strong> {complaint.address || "N/A"}
            </p>

            <p className="cd-description"> <strong>Description:</strong> {complaint.description}</p>

            

            {/* ---------------- Admin Section ---------------- */}
            {user?.role === "admin" && complaint.status === "received" && (
              <div className="cd-section">
                <h3>Assign Volunteer</h3>
                <select
                  onChange={(e) => handleAssign(e.target.value)}
                >
                  <option value="">Select Volunteer</option>
                  <option value="v1">Rahul Sharma</option>
                  <option value="v2">Anjali Verma</option>
                  <option value="v3">Mohit Singh</option>
                </select>
              </div>
            )}

            {/* ---------------- Volunteer Section ---------------- */}
            {user?.role === "volunteer" && (
              <div className="cd-section">
                <h3>Update Status</h3>

                <select
                  value={complaint.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value="received">Received</option>
                  <option value="in progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            )}

          </div>


          </div>

          <div className="cd-map-container">
            <div id="complaintMap" className="cd-map"></div>
          </div>

        </div>

        
      </div>
    </div>
  );
};

export default ComplaintDetails;