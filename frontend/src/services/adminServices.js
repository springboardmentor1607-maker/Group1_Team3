import API from "@/api/axios";

const token = localStorage.getItem("token");

export const getresolvedComplaints = async ()=>{
    const response = await API.get("/admin/complaints/resolved?status=resolved",{
        headers : {
            Authorization : `Bearer ${token}`
        }
    });

    return response.data;
}