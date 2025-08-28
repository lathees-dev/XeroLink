import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String }
});

const shopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    location: { type: String, required: true },
    services: { type: [serviceSchema], default: [] },
    isOpen: { type: Boolean, default: true },
    description: { type: String },
    role: { type: String, enum: ['shop'], default: 'shop' },
})

export default mongoose.model("Shop", shopSchema);