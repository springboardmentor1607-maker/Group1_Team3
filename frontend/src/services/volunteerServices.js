import API from "../api/axios";

/**
 * Get complaints assigned to the logged-in volunteer
 * @param {string} status - Optional status filter (assigned, in_progress, resolved)
 * @returns {Promise} API response with complaints
 */
export const getVolunteerComplaints = async (status = null) => {
  const token = localStorage.getItem("token");
  
  console.log("getVolunteerComplaints called with status:", status);
  console.log("Token exists:", !!token);
  
  if (!token) {
    throw new Error("No authentication token found. Please login again.");
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Add status query parameter if provided
  if (status) {
    config.params = { status };
  }

  console.log("Making API request to /volunteer/my-complaints");
  const response = await API.get("/volunteer/my-complaints", config);
  console.log("API response:", response.data);
  return response.data;
};

/**
 * Update complaint status (volunteer can change: assigned -> in_progress -> resolved)
 * @param {string} complaintId - ID of the complaint
 * @param {string} status - New status (in_progress or resolved)
 * @returns {Promise} API response with updated complaint
 */
export const updateComplaintStatus = async (complaintId, status) => {
  const token = localStorage.getItem("token");

  const response = await API.patch(
    `/complaints/${complaintId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
