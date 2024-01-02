const mongoose = require("mongoose");

const Album = new mongoose.Schema({
    tittle: {
        type: String,
        required: [true, "The tittle is required"],
    },
    description: {
        type: String,
        required: [true, "The description is required"],
        minLength: 5,
        maxLength: 300,
    },
    yearOfRelease: {
        type: Number,
        required: [true, "The year is required"],
        min: 1,
    },
    songs: [{ tittle: { type: String }, duration: { type: String }, link: { type: String } }],
    cover: { type: String },
});

module.exports = mongoose.model("Album", Album);