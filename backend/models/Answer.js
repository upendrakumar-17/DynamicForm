const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
    {
        type: {
            type: String,  //"planner", "performer", "crew".
            required: true,
        },
        answers: [
            {
                questionId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Question",
                    required: true,
                },
                response: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Answer", answerSchema);