import { Link, useNavigate } from 'react-router-dom'
import { clearAdminToken } from '../utils/auth'

const Home = () => {
     const navigate = useNavigate();

     const logout = () => {
          clearAdminToken();
          navigate('/login', { replace: true });
     };

     return (
          <div className='flex items-center justify-center flex-col min-h-screen gap-4 text-white py-10'>
               <button onClick={logout} className='bg-orange-600 px-10 py-3 rounded-2xl text-center w-100 cursor-pointer'>
                    Logout
               </button>
               <Link to="/blogs" className='bg-orange-600 px-10 py-3 rounded-2xl text-center w-100'>Blogs</Link>
               <Link to="/courses" className='bg-orange-600 px-10 py-3 rounded-2xl text-center w-100'>Courses</Link>
               <Link to="/location" className='bg-orange-600 px-10 py-3 rounded-2xl text-center w-100'>Location</Link>
               <Link to="/site-meta" className='bg-orange-600 px-10 py-3 rounded-2xl text-center w-100'>Site Meta</Link>
               <Link to="/faq" className='bg-orange-600 px-10 py-3 rounded-2xl text-center w-100'>Faq</Link>
               <Link to="/companies-worked" className='bg-orange-600 px-10 py-3 rounded-2xl text-center w-100'>Companies Worked</Link>
               <Link to="/home-data" className='bg-orange-600 px-10 py-3 rounded-2xl text-center w-100'>Home Data</Link>
               <Link to="/about-data" className='bg-orange-600 px-10 py-3 rounded-2xl text-center w-100'>About Data</Link>
          </div>
     )
}

export default Home
