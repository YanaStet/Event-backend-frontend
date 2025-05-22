import mongoose from 'mongoose';

const CardSchema = mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
},);

export default mongoose.model('Card', CardSchema);