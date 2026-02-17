import Users from "../models/user.model.js"

export const getUser = async (req,res)=>{

    try {
        const user = await Users.findById(req.user.id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message : "Error fetching user"})
    }

}



export const updateProfile = async (req,res)=>{
    try {

        const userId = req.user.id
        const { name,mobile,location,bio } = req.body;

        const user = await Users.findById(userId);

        if(!user) res.status(404).json({message : "user not found"});

        if(name) user.name = name;
        if(mobile) user.mobile = mobile;
        if(location) user.location = location;
        if(bio) user.bio = bio;

        //profile photo url should be given by cloudinary

        await user.save();

        res.status(200).json({
            success : true,
            message : "Profile Updated Successfully",
            user
        })


    } catch (error) {

        res.status(500).json({
            message : "error updating profile..",
            error : error.message
        })
        
    }
}