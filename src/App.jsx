import { Route, Routes } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import Home from "./pages/Home"
import Blogs from "./pages/Blogs"
import Login from "./pages/Login"
import Courses from "./pages/Courses"
import Locations from "./pages/Location"
import PageSEOManager from "./pages/PageSEOManager"
import FaqManager from "./pages/Faq"
import FooterManager from "./pages/FooterManager"
import CompanyWorked from "./pages/CompanyWorked"
import HomeData from "./pages/HomeData"
import AboutData from "./pages/AboutData"
import PolicyData from "./pages/PolicyData"
import ContactData from "./pages/ContactData"
import NavbarManager from "./pages/NavbarManager"

import AdminLayout from "./components/AdminLayout"

const protectedPage = (page) => (
  <ProtectedRoute>
    <AdminLayout>
      {page}
    </AdminLayout>
  </ProtectedRoute>
)

const App = () => {
  return (
    <div className="poppins-regular">
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={protectedPage(<Home />)} />
        <Route path='/blogs' element={protectedPage(<Blogs />)} />
        <Route path='/courses' element={protectedPage(<Courses />)} />
        <Route path='/location' element={protectedPage(<Locations />)} />
        <Route path='/site-meta' element={protectedPage(<PageSEOManager />)} />
        <Route path='/faq' element={protectedPage(<FaqManager />)} />
        <Route path='/footer' element={protectedPage(<FooterManager />)} />
        <Route path='/companies-worked' element={protectedPage(<CompanyWorked />)} />
        <Route path='/home-data' element={protectedPage(<HomeData />)} />
        <Route path='/about-data' element={protectedPage(<AboutData />)} />
        <Route path='/policy-settings' element={protectedPage(<PolicyData />)} />
        <Route path='/contact-settings' element={protectedPage(<ContactData />)} />
        <Route path='/navbar-settings' element={protectedPage(<NavbarManager />)} />
        
      </Routes>
    </div>
  )
}

export default App
