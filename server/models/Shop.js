import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
    name: {type : String, required: true},
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    location: { type: String, required: true },
    services: { type: [String], required: true },
    isOpen: { type: Boolean, default: true },
    role: { type: String, enum: ['shop'], default: 'shop' },
})

export default mongoose.model("Shop", shopSchema);