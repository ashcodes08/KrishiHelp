import mongoose from "mongoose";

const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  
  quantity: {
    type: Number,
    required: true,
  },
  pricePerKg: {
    type: Number,
    required: true,
  },
  type:{
    type:String,
    required:true,
  },
});

const Crop = mongoose.model('Crop', cropSchema);
export default Crop;
