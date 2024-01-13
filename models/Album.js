const mongoose = require("mongoose");

const Album = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "The tittle is required"],
    },
    description: {
        type: String,
        required: [true, "The description is required"],
        minLength: 5,
        maxLength: 500,
    },
    yearOfRelease: {
        type: Number,
        required: [true, "The year is required"],
        min: 1900,
        max: 2030,
    },
    songs: [{
        title: {type: String},
        duration: {type: String},
        link: {type: String},
    }],
    cover: {
        type: String,
    },
});

module.exports = mongoose.model("Album", Album);