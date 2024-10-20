import Donation from "../models/donation.model.js";

export const donationCompletion = async (req, res) => {
  try {
    const { phoneNumber, amount, payment_id} = req.body;

    const newDonation = new Donation({
      phoneNumber,
      amount,
      payment_id,    
    });

    await newDonation.save();

    res.status(200).json({
      success: true,
      message: "Donation successfully recorded",
      donation: newDonation,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      success: false,
      message: "Failed to record donation",
      error: error.message, // Optionally send the error message back
    });
  }
};
