import Users from "../models/user.model.js";
import jwt from "jsonwebtoken"



export const signup = async (req, res) => {
    try {
        console.log("SIGNUP API HIT");
        console.log("BODY:",req.body);
        const { name, email, password, role, mobile, state } = req.body;
        const existingUser = await Users.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exist" })
        }

        const user = await Users.create({
            name,
            email,
            password,
            state,
            role: role || "user",
            mobile: mobile || null
        })
        console.log("USER SAVED:",user);

        res.status(201).json({
            message: "User registered Successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })

    } catch (error) {
        res.status(500).json({ message: "Sign up fail", error: error.message })
    }

    

   

} 






export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials.."
            })
        }

        let isMatch = false;

        if (password === user.password) {
            isMatch = true;
        }

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials..." })
        }

        //Generate Token...
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({
            message: "Login successful...",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                mobile : user.mobile ?? null,
                location : user.location ?? null,
                bio : user.bio ?? null
            },
        });


    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });

    }
}