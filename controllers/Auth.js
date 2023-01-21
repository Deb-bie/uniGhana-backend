const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const User = require("../models/User.js")

// create error handling system
// connect to db
// jwt key in env



const register = async (req, res, next) => {
    try {
        const {username, email, password, confirmPassword} = req.body;

        // checking whether password and confirm passwords match
        if (password !== confirmPassword) {
            return res.status(400).json(`Password and Confirm Password do not match`)
        }


        // checking whether username or email or password is present
        if (!username || !email || !password) {
            return res.status(400).json(`Username, Email and password are required`)
        }

        // checking to make sure that the password length is not less than 6
        if (password.length < 6) {
            return res.status(400).json(`Password should not be less than 6 characters`)
        }

        // checking whether the email already exists
        const user = await User.findOne({email})
        if (user) return res.status(400).json(`Email already in use.`)

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const newUser = new User(
            {
                username: username,
                email: email,
                password: hash
            }
        );

        await newUser.save();
        res.status(200).send("User has been created")
    } catch (error) {
        next(error)
    }

}


const login = async (req, res, next) => {
    try {
        const { email, password} = req.body;
        
        // checking whether email and password are present
        if(!email || !password) return res.status(400).json(`Email and Password are required`)

        // checking if user exists in the db
        const user = await User.findOne(
            {email: email}
        )

        if(!user) return res.status(400).json(`Email does not exist`)

        // checking if the password is valid
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) return res.status(400).json(`Wrong password or email`)

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT
        );
  
        // const { password,...otherDetails } = user._doc;
        res.cookie("access_token", token, {httpOnly: true})
        .status(200).json(user._doc);

    } catch (error) {
        console.log(error)
    }

}



module.exports = {
    register,
    login
}