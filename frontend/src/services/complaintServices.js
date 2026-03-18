import axios from "axios";

const API = "http://localhost:5000/api/complaints";

export const updateComplaintStatus = async (id, data) => {
  try {
    console.log("🔥 SERVICE HIT");

    const response = await axios.patch(
      `${API}/${id}/status`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    console.log("✅ RESPONSE:", response.data);
    return response;

  } catch (error) {
    console.error("❌ SERVICE ERROR:", error);
    throw error;
  }
};