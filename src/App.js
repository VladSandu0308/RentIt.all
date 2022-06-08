import { BrowserRouter, Route, Routes, Switch} from 'react-router-dom';
import Blog from './components/Blog';
import Contact from './components/Contact';
import AddDescription from './components/Host/AddDescription';
import AddFacilities from './components/Host/AddFacilities';
import AddFurnished from './components/Host/AddFurnished';
import AddGuests from './components/Host/AddGuests';
import AddLocation from './components/Host/AddLocation';
import AddName from './components/Host/AddName';
import AddPictures from './components/Host/AddPictures';
import AddPrice from './components/Host/AddPrice';
import AddRentBuy from './components/Host/AddRentBuy';
import AddReview from './components/Host/AddReview';
import HostMain from './components/Host/HostMain';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';
import SearchHouse from './components/SearchHouse';
import SetPhone from './components/SetPhone';
import UpdateProfile from './components/UpdateProfile';
import { AuthProvider } from './context/UserAuthContext';

function App() {
  return (
    <div className="App">
      <div className='container-fluid homepage-bgimage'>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />}/>
              <Route path="/" element={<Register />}/>
              <Route path="/setPhone" element={<SetPhone />}/>
              <Route path="/reset" element={<ResetPassword />}/>
              <Route path="/updateProfile" element={
                <PrivateRoute>
                  <UpdateProfile />
                </PrivateRoute>
              }/>
              <Route path="/search" element={
                <PrivateRoute>
                  <SearchHouse />
                </PrivateRoute>
              }/>
              <Route path="/host" element={
                <PrivateRoute>
                  <HostMain />
                </PrivateRoute>
              }/>
              <Route path="/host/add/location" element={
                <PrivateRoute>
                  <AddLocation />
                </PrivateRoute>
              }/>
              <Route path="/host/add/mode" element={
                <PrivateRoute>
                  <AddRentBuy />
                </PrivateRoute>
              }/>
              <Route path="/host/add/title" element={
                <PrivateRoute>
                  <AddName />
                </PrivateRoute>
              }/>
              <Route path="/host/add/description" element={
                <PrivateRoute>
                  <AddDescription />
                </PrivateRoute>
              }/>
              <Route path="/host/add/guests" element={
                <PrivateRoute>
                  <AddGuests />
                </PrivateRoute>
              }/>
              <Route path="/host/add/facilities" element={
                <PrivateRoute>
                  <AddFacilities />
                </PrivateRoute>
              }/>
              <Route path="/host/add/furnished" element={
                <PrivateRoute>
                  <AddFurnished />
                </PrivateRoute>
              }/>
              <Route path="/host/add/pictures" element={
                <PrivateRoute>
                  <AddPictures />
                </PrivateRoute>
              }/>
              <Route path="/host/add/price" element={
                <PrivateRoute>
                  <AddPrice />
                </PrivateRoute>
              }/>
              <Route path="/host/add/review" element={
                <PrivateRoute>
                  <AddReview />
                </PrivateRoute>
              }/>
              <Route path="/blog" element={
                <PrivateRoute>
                  <Blog />
                </PrivateRoute>
              }/>
              <Route path="/contact" element={
                <PrivateRoute>
                  <Contact />
                </PrivateRoute>
              }/>
            </Routes>
          </AuthProvider>
          
        </BrowserRouter>
        
        
      </div>
    </div>
  );
}

export default App;
