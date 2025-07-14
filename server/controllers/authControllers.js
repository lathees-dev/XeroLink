import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import generateToken from '../utils/generateToken.js'

export const register = async (req, res) => {
    const { name, email, phone, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) { return res.status(400).json({ message: "User already exists" }) }
    
    const hashedPw = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPw,phone, role })

    const token = generateToken(user._id, user.role);
    res.status(201).json({ token, user: { id: user._id, name: user.name, role: user.role } })
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) { return res.status(400).json({ message: "User not found" }) }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) { return res.status(401).json({ message: "Invalid Credentials" }) }
    
    const token = generateToken(user._id, user.role);
    res.status(200).json({token, user: {id: user._id, name: user.name, role: user.role}})
}