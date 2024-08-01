import mongoose, { Schema, Document } from 'mongoose';

export interface Trending extends Document {
    titles: string[];
    date: Date;
}

const trendingSchema: Schema<Trending> = new Schema({
    titles: {
        type: [String],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const TrendingModel = (mongoose.models.Trending as mongoose.Model<Trending>) || mongoose.model<Trending>('Trending', trendingSchema);

export default TrendingModel;
