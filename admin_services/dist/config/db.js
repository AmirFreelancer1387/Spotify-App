import mongoose from 'mongoose';
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOSE_URL, {
            dbName: 'spotifyDB'
        });
        console.log('mongoose is connected');
    }
    catch (error) {
        console.log(error);
    }
};
export default connectDB;
//# sourceMappingURL=db.js.map