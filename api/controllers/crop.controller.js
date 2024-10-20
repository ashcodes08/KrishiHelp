import Crop from "../models/crop.model.js";

// Get all crops irrespective of the user
export const getAllCrops = async (req, res) => {
    try {
      const { searchTerm, category, minPrice, maxPrice } = req.query;
  
      let query = {};
  
      if (searchTerm) {
        query.name = { $regex: searchTerm, $options: 'i' };
      }
  
      if (category && category !== '') {
        query.type = category;
      }
  
      if (minPrice && maxPrice) {
        query.pricePerKg = { $gte: minPrice, $lte: maxPrice };
      } else if (minPrice) {
        query.pricePerKg = { $gte: minPrice };
      } else if (maxPrice) {
        query.pricePerKg = { $lte: maxPrice };
      }
      const crops = await Crop.find(query);
      res.status(200).json({ crops });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch crops' });
    }
  };
  
export const getCrops = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have user ID stored in req.user
        const crops = await Crop.find({ userId: userId }); // Fetch crops specific to the user        
        res.json({ crops });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch crops' });
    }
};

// Add a new crop
export const addCrop = async (req, res) => {
    const { name, type, pricePerKg, quantity } = req.body;

    if (!name || !pricePerKg || !quantity || !type) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const userId = req.user.id; // Assuming you have user ID stored in req.user
        const newCrop = new Crop({
            name,
            type,
            pricePerKg,
            quantity,
            userId, // Set the userId when creating a new crop
        });

        await newCrop.save();
        res.status(201).json({ crop: newCrop });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add crop' });
    }
};

// Update crop quantity
export const updateQuantity = async (req, res) => {
    const { cropId, quantity } = req.body;

    // Validate input
    if (!cropId || quantity === undefined) {
        return res.status(400).json({ message: 'Crop ID and quantity are required' });
    }

    try {
        // Find the crop by ID and ensure it belongs to the user
        const userId = req.user.id; // Get user ID from the request
        const updatedCrop = await Crop.findOneAndUpdate(
            { _id: cropId, userId: userId }, // Ensure the crop belongs to the user
            { quantity },
            { new: true } // Return the updated crop
        );

        if (!updatedCrop) {
            return res.status(404).json({ message: 'Crop not found or does not belong to user' });
        }

        // Respond with the updated crop
        res.status(200).json({
            message: 'Quantity updated successfully',
            crop: updatedCrop,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update quantity' });
    }
};

// Delete a crop
export const deleteCrop = async (req, res) => {
  const { cropId } = req.body;

  if (!cropId) {
      return res.status(400).json({ message: 'Crop ID is required' });
  }

  try {
      const userId = req.user.id;

      const deletedCrop = await Crop.findOneAndDelete({ _id: cropId, userId: userId });

      if (!deletedCrop) {
          return res.status(404).json({ message: 'Crop not foundr' });
      }

      res.status(200).json({ message: 'Crop deleted successfully' });
  }
  catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to delete crop' });
  }
};


export const updatePrice = async (req, res) => {
    const { cropId, pricePerKg } = req.body;
  
    if (!cropId || pricePerKg === undefined) {
      return res.status(400).json({ message: 'Crop ID and price per kg are required' });
    }
  
    try {
      const userId = req.user.id; // Assuming you have user ID stored in req.user
  
      const updatedCrop = await Crop.findOneAndUpdate(
        { _id: cropId, userId: userId }, // Ensure the crop belongs to the user
        { pricePerKg },
        { new: true } // Return the updated crop
      );
  
      if (!updatedCrop) {
        return res.status(404).json({ message: 'Crop not found or does not belong to user' });
      }
  
      res.status(200).json({
        message: 'Price updated successfully',
        crop: updatedCrop,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update price' });
    }
  };

  export const getSpecificCrop = async (req, res) => {
    try {
        const cropId = req.params.cropId;
        const crops = await Crop.find({ _id: cropId }); 
        
        if (crops.length === 0) {
            return res.status(404).json({ error: 'Crop not found' });
        }
        
        res.json(crops); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch crops' });
    }
};


export const updateQty = async (req, res) => {
  try {
    const { cart } = req.body;

    if (!Array.isArray(cart)) {
      return res.status(400).json({ error: 'Cart should be an array' });
    }

    for (const item of cart) {
      console.log("Processing item:", item); 
      const { userId, _id, qty } = item;

      if (!userId || !_id || typeof qty !== 'number') {
        return res.status(400).json({ error: 'Invalid userId, cropId, or quantity' });
      }

      const crop = await Crop.findOne({ _id: _id, userId: userId });
      if (!crop) {
        return res.status(404).json({ error: `Crop with ID ${_id} for farmer ${userId} not found` });
      }

      crop.quantity -= qty; 
      if (crop.quantity < 0) {
        return res.status(400).json({ error: `Insufficient quantity for crop ${_id}` });
      }
      
      await crop.save();
    }

    return res.status(200).json({ message: 'Crop quantities updated successfully' });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: 'Failed to update crops' });
  }
};
