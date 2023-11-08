import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    userId: {
        type: Number,
        unique: true,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,

    },
    lastName: {
        type: String,
        required: true,
    },
    is_active: {
        type: Boolean,
        default: true,
    },
    is_superuser: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
})

export default mongoose.model('User', UserSchema)