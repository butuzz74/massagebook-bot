import { Schema, model } from "mongoose";

const bookingShema = new Schema({
    telegramID: Number,
    massageId: { type: Schema.Types.ObjectId, ref: "Massage" },
    massage: String,
    date: String,
    time: String,
    name: String,
    phone: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default model("Booking", bookingShema);
