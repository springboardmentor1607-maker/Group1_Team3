import Users from "../models/user.model.js"


export const getAllVolunteers = async (req,res)=>{
    try{

        const volunteers = await Users.find({role : "volunteer"}).select("-password").sort({created : -1});

        res.status(200).json({
            success: true,
            count : volunteers.length,
            volunteers
        })

    } catch(error){
        res.status(500).json({
            success : false,
            message : "error fetching details..",
            error : error.message
        })
    }
}