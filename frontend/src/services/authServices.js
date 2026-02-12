import API from "../api/axios"


export const signup = async (data)=>{
    const response = await API.post("/user/signup",data);
    return response.data;
};

export const login = async (data)=>{
    const response = await API.post("/user/login",data);
    return response.data;
}