import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: {type: String, enum:['student'], default: "student"}
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
