import React,{useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import { useSelector , useDispatch} from "react-redux";
import CartItem from './CartItem/CartItem';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { signoutCart } from '../../redux/cart/cartSlice';
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import axios from 'axios'; // For making API requests
function Cart1() {



   const navigate = useNavigate();
   // cart ko store se yaha par laaya jaaye
   const currUser = useSelector((state) => state.user);
   const cart =  useSelector((state)=>{
    return state.shop.cart;
    })

    const dispatch = useDispatch();

    const handlePayment = async () => {
  try {
    // Send a request to your backend to create a Razorpay order using fetch
    const response = await fetch('http://localhost:3000/createOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: totalPrice,
        name: 'Cart Purchase',
        description: 'Payment for items in your cart',
      }),
    });

    const data = await response.json();

    // If the order is created successfully, proceed with Razorpay checkout
    if (data.success) {
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: "INR",
        name: data.product_name,
        description: data.description,
        image: ShoppingCartTwoToneIcon, // Optional image
        order_id: data.order_id, // Order ID returned from your backend
        handler: async function (response) {
          alert("Payment Successful");
         
          const cartOrder={
            userId: currUser.currentUser._id, // Replace with actual user ID
            cart: cart,
            totalPrice: totalPrice,
            paymentId: response.razorpay_payment_id,
          }
          console.log(cart);
             // Once the payment is successful, create an order in your system
          await fetch('/api/order/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(cartOrder),
          });
          await fetch('/api/crop/updateQty', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({cart}),
          });
          
          dispatch(signoutCart());
          // when payment is successful we empty the card
          // Optionally, you can handle post-payment logic here 
          navigate('/market');

          // Optionally, you can handle post-payment logic here
        },
        prefill: {
          name: data.name,
          email: data.email,
          contact: data.contact,
         
        },
        theme: {
          color: "#2300a3",
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      razorpay.on('payment.failed', function (response) {
        alert("Payment Failed: " + response.error.description);
      });
    } else {
      alert('Order creation failed');
    }
  } catch (error) {
    console.error('Error during payment:', error);
    alert('Something went wrong!');
  }
};



   
    const [totalItems,setTotalItems] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    useEffect(() => {
      let items = 0;
      let price = 0;
  
      cart.forEach((item) => {
        items += Number(item.qty) || 0;
        price += item.qty * item.pricePerKg;
      });
  
      setTotalItems(items);
      setTotalPrice(price);
    }, [cart]);
  
    return (
        <>
        {cart.length==0?<div className='container-div1 dark:bg-slate-700' >
        <ShoppingCartTwoToneIcon style={{marginBottom:'2%' , fontSize : '8vw' , color: 'green'}}/>
          <p style={{fontSize : '3vw',fontWeight:'500'}} className=''> <span className=' font-aclonica px-2 py-1 bg-gradient-to-r from-green-800 via-green-600 to-green-400 rounded-lg text-white '>
          Krishi-Cart
        </span> is currently empty</p>
        </div>:
        <div className='container-div bg-slate-300' >
            <div className='items dark:bg-slate-500'>
                <div className='header'>
                    <p style={{paddingTop: '2%',paddingLeft: '2%',marginBottom:'3%',fontSize : '25px',fontWeight:'700'} } className='dark:bg-slate-700 pb-2'>Krishi Cart</p>
                  
                    
                </div >
                <div className='added '>
                    
                         {cart.map((item) => (
                            <CartItem key={item._id} item={item} />
                          ))}
                    
                </div>
            </div>
            <div className='details-c '>
              <div className='details dark:bg-slate-500'>
            <h4 style={{textAlign:'center', paddingTop:'5%'}} className='dark:bg-slate-700 pb-2'>Cart Summary</h4>
        <div style={{textAlign:'center', marginBottom: '5%', marginTop:'5%'}} >
          <span>Subtotal ({totalItems} items) : </span>
          <span style={{fontWeight:'bold'}}>₹ {totalPrice}</span>
        </div>
        
        
        
        <div className='checkout'>
        <Button variant="contained" color="primary" onClick={handlePayment}>
          Proceed To Buy
        </Button>
        </div>
            </div>
            </div>
        </div>
        }
        </>
    )
}
export default Cart1;