import { Alert, Button, Label, Spinner, TextInput, Select } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '', role: '' });
  const { loading, error: errorMessage } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleRoleChange = (e) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.role) {
      return dispatch(signInFailure("Please fill in all the fields"));
    }

    try {
      dispatch(signInStart());

      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div
      className='min-h-screen flex items-center justify-center'
      style={{
        backgroundImage: `url('https://blog.agribegri.com/public/blog_images/sustainable-farming-techniques-crop-rotation-and-intercropping-patterns-in-indian-agriculture-600x400.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className='relative p-5 max-w-3xl mx-auto bg-white bg-opacity-80 rounded-lg shadow-lg text-black'>
        <div className='flex flex-col md:flex-row md:items-center gap-5 text-black'>
          <div className='flex-1 text-black'>
            <Link to='/' className='font-aclonica  text-4xl'>
              <span className='px-3 py-2 bg-gradient-to-r from-green-800 via-green-600 to-green-400 rounded-lg text-white font-aclonica'>
                Krishi
              </span>
              Help
            </Link>
            <p className='text-sm mt-5'>
              This is a demo project. You can sign in with your email and password or with Google.
            </p>
          </div>
          <div className='flex-1'>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
              <div>
                <Label style={{ color: 'black' }}  value='Your email' />
                <TextInput
                  type='email'
                  placeholder='name@company.com'
                  id='email'
                  onChange={handleChange}
                  className='focus:ring-2 focus:ring-purple-500'
                  style={{ color: 'black', backgroundColor: 'white' }}
                />
              </div>
              <div>
                <Label style={{ color: 'black' }}  value='Your password' />
                <TextInput
                  type='password'
                  placeholder='Password'
                  id='password'
                  onChange={handleChange}
                  className='focus:ring-2 focus:ring-purple-500'
                  style={{ color: 'black', backgroundColor: 'white' }}
                />
              </div>
              <div>
                <Label style={{ color: 'black' }}  value='Role' />
                <Select
                  id='role'
                  value={formData.role}
                  onChange={handleRoleChange}
                  required
                  className='focus:ring-2 focus:ring-purple-500'
                  style={{ color: 'black', backgroundColor: 'white' }}
                >
                  <option value=''>Select your role</option>
                  <option value='farmer'>Farmer</option>
                  <option value='distributor'>Distributor</option>
                </Select>
              </div>
              <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size='sm' />
                    <span className='pl-3'>Loading...</span>
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
              <OAuth />
            </form>
            <div className='flex gap-2 text-sm mt-5'>
              <span>Don't have an account?</span>
              <Link to='/sign-up' className='text-blue-700 font-bold'>
                Sign Up
              </Link>
            </div>
            {errorMessage && (
              <Alert className='mt-5' color='failure'>
                {errorMessage}
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
