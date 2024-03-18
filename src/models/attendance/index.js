import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  attendance: { type: Boolean, default: false },
});

// must be singular , in mongodb it will be automaically plural
const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
