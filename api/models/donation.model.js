import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
    },
    amount: {
      type: Number, 
      required: true,
    },
    payment_id: {
      type: String,
      required: true, 
    },
  },
  { timestamps: true }  
);

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;
