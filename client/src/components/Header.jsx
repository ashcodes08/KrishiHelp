import { Avatar, Button, Dropdown, Navbar } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import {signoutCart} from '../redux/cart/cartSlice';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
export default function Header() {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const navigate = useNavigate(); // Use useNavigate for navigation

  const cart =  useSelector((state)=>{
    return state.shop.cart;})
    const [cartCount, setCartCount] = useState(0);
  
    useEffect(() => {
      let count = 0;
      cart.forEach((item) => {
        count += 1;
      });
  
      setCartCount(count);
    }, [cart, cartCount]);


  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        dispatch(signoutCart());
        navigate('/'); // Redirect to the home page after successful signout
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Navbar className='border-b-2 bg-yellow-100'>
      <Link
        to='/'
        className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white font-aclonica'
      >
        <span className='px-2 py-1 bg-gradient-to-r from-green-800 via-green-600 to-green-400 rounded-lg text-white font-aclonica'>
      Krishi
    </span>
    

        Help
      </Link>
      
      <div className='flex gap-2 md:order-2'>
        <Button
          className='w-12 h-10 hidden sm:inline'
          color='gray'
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === 'light' ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <>
          {!currentUser.isFarmer && (<Link to='/cart' style={{color:'#2f3542'}}>
          <Button color="inherit" className='dark:text-white'>Cart<ShoppingCartIcon style={{marginLeft:'12%', marginRight:'1%'}}/><span className='cartNumber dark:text-white' style={{}}>{cartCount}</span></Button>
          </Link>)}
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt='user' img={currentUser.profilePicture} rounded />
            }
          >
            {/* <Dropdown.Header>
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>
                {currentUser.email}
              </span>
            </Dropdown.Header> */}
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
          </>
        ) : (
          <Link to='/sign-in'>
            <Button gradientDuoTone='purpleToBlue' outline>
              Sign In
            </Button>
          </Link>
        )}


      </div>
      <Navbar.Collapse className='flex space-x-4 items-center'>
  <Navbar.Link active={path === '/'} as={'div'} className={`${path === '/' ? 'bg-green-500 text-white font-bold' : 'text-gray-700'}  px-4 py-2 rounded-lg`}>
    <Link to='/'>Home</Link>
  </Navbar.Link>
  <Navbar.Link active={path === '/about'} as={'div'} className={`${path === '/about' ? 'bg-green-500 text-white font-bold' : 'text-gray-700'}  px-4 py-2 rounded-lg`}>
    <Link to='/about'>About</Link>
  </Navbar.Link>
  <Navbar.Link active={path === '/news'} as={'div'} className={`${path === '/news' ? 'bg-green-500 text-white font-bold' : 'text-gray-700'}  px-4 py-2 rounded-lg`}>
    <Link to='/news'>News</Link>
  </Navbar.Link>

  {currentUser && currentUser.isFarmer && (
    <Navbar.Link active={path === '/search'} as={'div'} className={`${path === '/search' ? 'bg-green-500 text-white font-bold' : 'text-gray-700'} hover:text-green-500 px-4 py-2 rounded-lg`}>
      <Link to='/search'>Articles</Link>
    </Navbar.Link>
  )}
  {currentUser && currentUser.isFarmer && (
    <Navbar.Link active={path === '/shops'} as={'div'} className={`${path === '/shops' ? 'bg-green-500 text-white font-bold' : 'text-gray-700'} hover:text-green-500 px-4 py-2 rounded-lg`}>
      <Link to='/shops'>Shops</Link>
    </Navbar.Link>
  )}
  
  {currentUser && !currentUser.isFarmer && (
    <Navbar.Link active={path === '/market'} as={'div'} className={`${path === '/market' ? 'bg-green-500 text-white font-bold' : 'text-gray-700'} hover:text-yellow-500 px-4 py-2 rounded-lg`}>
      <Link to='/market'>Market</Link>
    </Navbar.Link>
  )}
  {currentUser && !currentUser.isFarmer && (
    <Navbar.Link active={path === '/trends'} as={'div'} className={`${path === '/trends' ? 'bg-green-500 text-white font-bold' : 'text-gray-700'} hover:text-yellow-500 px-4 py-2 rounded-lg`}>
      <Link to='/trends'>Trends</Link>
    </Navbar.Link>
  )}
  
</Navbar.Collapse>

    </Navbar>
  );
}
