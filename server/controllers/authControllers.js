import Student from '../models/User.js'
import Shop from '../models/Shop.js'
import bcrypt from 'bcryptjs'
import generateToken from '../utils/generateToken.js'

const getModelByRole = (role) => {
    if (role === 'student') {
        return Student;
    }
    if (role === 'shop') {
        return Shop;
    }
    throw new Error('Invalid role');
}


export const register = async (req, res) => {
    const { name, email, phone, password, role } = req.body;
    try {
        const Model = getModelByRole(role);
        const userExists = await Model.findOne({ email });
        if (userExists) { return res.status(400).json({ message: "User already exists" }) }
    
        const hashedPw = await bcrypt.hash(password, 10);
        const user = await Model.create({ name, email, password: hashedPw, phone, role })

        const token = generateToken(user._id, user.role);
        res.status(201).json({ token, user: { id: user._id, name: user.name, role: user.role } })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

export const login = async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const Model = getModelByRole(role);
        const user = await Model.findOne({ email });
        if (!user) { return res.status(400).json({ message: "User not found" }) }
    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { return res.status(401).json({ message: "Invalid Credentials" }) }
    
        const token = generateToken(user._id, user.role);
        res.status(200).json({ token, user: { id: user._id, name: user.name, role: user.role } })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
}