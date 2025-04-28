import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    questionSetId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "QuestionSet",
        required: true 
    },
    text: { 
        type: String, 
        required: true 
    },
    options: {
        A: { type: String, required: true },
        B: { type: String, required: true },
        C: { type: String, required: true },
        D: { type: String, required: true }
    },
    correctAnswer: { 
        type: String, 
        enum: ["A", "B", "C", "D"], 
        required: true 
    },
    difficulty: { 
        type: String, 
        enum: ["easy", "medium", "hard"], 
        default: "easy" 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Question = mongoose.model('Question', questionSchema);
export default Question;