import mongoose from "mongoose";

const TestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    questionSetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuestionSet',
    },
    totalQuestions: { type: Number, required: true },
    easy: { type: Number, required: true },
    medium: { type: Number, required: true },
    hard: { type: Number, required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    duration: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    mode: { 
      type: String, 
      enum: ['public', 'assigned', 'private'], 
      default: 'private' 
    },
    assignedStudentsId: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }],
    multipleAttempts: { type: Boolean},
});

const Test = mongoose.model('Test', TestSchema);
export default Test;