import { Alert, Button, Label, Spinner, TextInput, Select } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

// SignUp component handles user registration
export default function SignUp() {
  const [formData, setFormData] = useState({ role: 'Farmer' });
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleRoleChange = (e) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password || !formData.role) {
      return setErrorMessage('Please fill out all fields.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen pt-20'
      style={{
        backgroundImage: `url('https://blog.agribegri.com/public/blog_images/sustainable-farming-techniques-crop-rotation-and-intercropping-patterns-in-indian-agriculture-600x400.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      <div className='relative flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5 bg-white bg-opacity-90 shadow-lg rounded-lg'>
        {/* Left section */}
        <div className='flex-1 font-aclonica text-black'>
          <Link to='/' className='text-4xl'>
            <span className='px-3 py-2 bg-gradient-to-r from-green-800 via-green-600 to-green-400 rounded-lg text-white font-aclonica'>
              Krishi
            </span> Help
          </Link>
          <p className='text-sm mt-5 '>
            This is a demo project. You can sign up with your email and password or with Google.
          </p>
        </div>
        {/* Right section */}
        <div className='flex-1 '>
          <form className='flex flex-col gap-4 ' onSubmit={handleSubmit}>
            <div>
              <Label style={{ color: 'black' }}  value='Your username' />
              <TextInput
                className='text-black bg-white'
                type='text'
                placeholder='Username'
                id='username'
                onChange={handleChange}
                style={{ color: 'black', backgroundColor: 'white' }}
              />
            </div>
            <div>
              <Label style={{ color: 'black' }}  value='Your email' />
              <TextInput
                className='text-black bg-white'
                type='email'
                placeholder='name@company.com'
                id='email'
                onChange={handleChange}
                style={{ color: 'black', backgroundColor: 'white' }}
              />
            </div>
            <div>
              <Label style={{ color: 'black' }}  value='Your password' />
              <TextInput
                className='text-black bg-white'
                type='password'
                placeholder='Password'
                id='password'
                onChange={handleChange}
                style={{ color: 'black', backgroundColor: 'white' }}
              />
            </div>
            <div>
              <Label style={{ color: 'black' }}  value='Role' />
              <Select
                className='text-black bg-white'
                id='role'
                onChange={handleRoleChange}
                value={formData.role}
                style={{ color: 'black', backgroundColor: 'white' }}
              >
                <option value='Farmer'>Farmer</option>
                <option value='Distributor'>Distributor</option>
              </Select>
            </div>
            <Button
              gradientDuoTone='purpleToPink'
              type='submit'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 text-sm mt-5 text-black'>
            <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-700 font-bold'>
              Sign In
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
  );
}
