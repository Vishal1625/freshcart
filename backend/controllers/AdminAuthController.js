import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../generateToken.js';


export const adminLogin = async (req, res) => {
    const { email, password } = req.body;


    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ msg: 'Admin not found' });


    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ msg: 'Invalid Password' });


    res.json({ token: generateToken(admin._id) });
};