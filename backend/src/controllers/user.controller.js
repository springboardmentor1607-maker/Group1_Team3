import Users from "../models/user.model.js"

export const getUser = async (req,res)=>{

    try {
        const user = await Users.findById(req.user.id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message : "Error fetching user"})
    }

}