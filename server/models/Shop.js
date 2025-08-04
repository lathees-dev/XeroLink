import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
    name: {type : String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String, required: true },
    isOpen: { type: Boolean, default: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ['shop'], default: 'shop' },
})

export default mongoose.model("Shop", shopSchema);