import mongoose from 'mongoose';

const questionSetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, required: true },
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

const QuestionSet = mongoose.model('QuestionSet', questionSetSchema);
export default QuestionSet;
