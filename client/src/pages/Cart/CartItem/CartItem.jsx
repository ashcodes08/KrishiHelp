import React,{useState} from 'react'
import { useDispatch } from "react-redux";
// import {
//   adjustItemQty,
//   removeFromCart,
// } from "../../../redux/Shopping/shopping-actions";
import './CartItem.css';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import {adjustQuantity,removeFromCart} from '../../../redux/cart/cartSlice'
import { Badge,Card } from 'flowbite-react';
import { GiPlantWatering } from 'react-icons/gi';
function CartItem1({ item }) {

    
    const dispatch = useDispatch();
    const [input, setInput] = useState(item.qty);

    const handleQty = (e) => {
      const newQty = parseInt(e.target.value, 10); // Convert to integer
      if (newQty > 0) {
        setInput(newQty);
        dispatch(adjustQuantity({ id: item._id, qty: newQty }));
      }
    };



    return (
        <>
        <hr/>
        {/* <div className='itemContainer'>
            <div className='imgc'>
            <img src={item.image} alt={item.title}/>
            </div>
            <div className='desc'>
                <div className='itemName'>
            <h3> <p></p>Item-name : {item.name}</h3>
            </div>
            <div className='itemQuantity'>
            <label htmlFor="qty">Qty</label>
          <input
            min="1"
            type="number"
            id="qty"
            name="qty"
            value={input}
            onChange={handleQty}
          />
            </div>
            <div className='itemdesc'>
            <p style={{    color:'#222f3e', fontFamily: 'cursive', textAlign: 'justify'}} >{item.type}</p>
            </div>
            <div className='pc'>
            <Button variant="contained" color="secondary"
          onClick={() => dispatch(removeFromCart({id:item._id}))}
        >
          <DeleteIcon/>Delete
        </Button>
            <h3 style={{marginTop: '1%', marginLeft: '4%'}}>₹ {item.price}</h3>
            </div>
            </div>
        </div> */}
        <Card className="flex flex-col gap-4 w-full max-w-xs dark:bg-slate-800 rounded-md shadow-md" style={{margin:'5px',height:'350px'}}>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-gray-500 text-md uppercase">{item.name}</h3>
            <p className="text-xl font-semibold">{item.qty} Kg</p>
          </div>
          {/* Adjusted icon size */}
          <GiPlantWatering className="text-teal-600 text-3xl" />
        </div>
        <p className="text-gray-500">Price per Kg: ₹{item.pricePerKg}</p>
        <p className="text-gray-500">Category: {item.type}</p>
        <p className="text-gray-500">Farmer ID:  {item.userId}</p>

        {/* Badges for any special tags */}
        <div className="flex flex-wrap gap-2">
          <Badge color="success">Organic</Badge>
          <Badge color="info">Fresh</Badge>
        </div>

        {/* Buttons for quantity control */}
        <div className="flex justify-between gap-3 mt-4">
        <Button variant="contained" color="secondary" style ={{width:'80%'}}
          onClick={() => dispatch(removeFromCart({id:item._id}))}
        >
          <DeleteIcon/><p style={{fontSize:"90%"}}>Remove</p>
        </Button>
        <div className='itemQuantity'>
            <label htmlFor="qty">Qty:</label>
          <input

            min="1"
            type="number"
            id="qty"
            name="qty"
            value={input}
            onChange={handleQty}
            className='dark:bg-slate-600'
          />
            </div>
        </div>
      </Card>
        </>
    )
}

export default CartItem1;