import mongoose from 'mongoose';

const CounterSchema = new mongoose.Schema({
    name: String,
    count: Number,
});

export default mongoose.model('Counter', CounterSchema)