import express from "express";
import mongoose from "mongoose";
import  dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import orderRoutes from "./routes/order.route.js"
import cookieParser from 'cookie-parser';
import postRoutes from "./routes/post.route.js"
import commentRoutes from "./routes/comment.route.js"
import cropRoutes from "./routes/crop.route.js"
import paymentRoute from "./routes/paymentRoutes.js"
import donationRoute from "./routes/donation.route.js"
import axios from "axios"
import cors from "cors";  // Import CORS
dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("MongoDB connection succesful");
})
.catch((err)=>{
    console.log(err);
})


const app=express()
app.use(cors());  // Enable CORS
app.use(express.json())
app.use(cookieParser())



app.listen(3000,()=>{
    console.log("Server is running on port https://localhost:3000");
})


const News = {
    defaultProps: {
      country: 'in', 
      pageSize: 20,   
      query: 'agriculture OR farming OR crops AND india',
    },
  };
  
  // News API handler
  app.get('/api/newsfetched/all-news', async (req, res) => {
    try {
      const { page = 1, pageSize = News.defaultProps.pageSize, country = News.defaultProps.country, query = News.defaultProps.query } = req.query;
  
      const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${process.env.NEWS_API_KEY}&page=${page}&pageSize=${pageSize}`;
  
      const response = await axios.get(url);
      const articles = response.data.articles;
      const totalResults = response.data.totalResults;
      res.status(200).json({
        success: true,
        data: {
          articles,
          totalResults,
        },
      });
    } catch (error) {
      console.error('Error fetching news:', error);
      res.status(500).json({
        success: false,
        message: error.response?.data.message || 'Failed to fetch news',
      });
    }
  });

  //Fetching Shop details
  app.get('/api/shops', async (req, res) => {
    try {
      const { city } = req.query;
      const foursquareApiKey = process.env.FOURSQUARE_API_KEY;
  
      const url = `https://api.foursquare.com/v3/places/search?query=agriculture+shops&near=${city}&limit=20&fields=name,location,tel,website`;
  
      const response = await axios.get(url, {
        headers: {
          Authorization: `${foursquareApiKey}`, 
          accept: 'application/json',
        },
      });
        const shops = response.data.results.map((shop) => {
         return {
          name: shop.name,
          address: shop.location?.formatted_address || "Not available",
          phoneNumber: shop.tel || "Not available",
          website: shop.website || "Not available",
        };
      });
  
      res.status(200).json({
        success: true,
        shops,
      });
    } catch (error) {
      console.error('Error fetching shops:', error);
      res.status(500).json({
        success: false,
        message: error.response?.data?.message || 'Failed to fetch shops',
      });
    }
  });

//Fetching Market Trends
  app.get('/api/trends', async (req, res) => {
    try {
      const { commodity, state, market } = req.query;
  
      const url = `http://127.0.0.1:5000/request?commodity=${commodity}&state=${state}&market=${market}`;
  
      const response = await axios.get(url);
      const data = response.data;
  
      if (data && data.results) {
        const prices = data.results.map((entry) => {
          return {
            date: entry.date,
            price: entry.modal_price,
            maxPrice: entry.max_price,
            minPrice: entry.min_price,
          };
        });
  
        res.status(200).json({
          success: true,
          prices,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'No price data available for the specified criteria.',
        });
      }
    } catch (error) {
      console.error('Error fetching Agmarknet data:', error);
      res.status(500).json({
        success: false,
        message: error.response?.data?.message || 'Failed to fetch Agmarknet data',
      });
    }
  });


app.use('/api/order', orderRoutes);
app.use('/api/user',userRoutes)
app.use('/api/auth',authRoutes)
app.use("/api/post",postRoutes)
app.use('/api/comment',commentRoutes)
app.use('/api/crop',cropRoutes)
app.use('/',paymentRoute)

app.use('/api/donation',donationRoute);
//middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  });
