import { Schema, model } from "mongoose";

const slotSchema = new Schema({
    time: { type: String, required: true },
    available: { type: Boolean, default: true },
});

const workDaySchema = new Schema(
    {
        date: { type: String, required: true, unique: true },
        slots: [slotSchema],
    },
    { timestamps: true }
);

export default model("WorkDay", workDaySchema);
