import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes, Switch} from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import { AuthProvider } from './context/UserAuthContext';
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute';
import UpdateProfile from './components/UpdateProfile';

function App() {
  return (
    <div className="App">
      <div className='container-fluid homepage-bgimage'>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/login" element = {<Login />}/>
              <Route path="/profile" element = {
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>}/>
              <Route path="/update-profile" element = {
                <PrivateRoute>
                  <UpdateProfile />
                </PrivateRoute>}/>
            </Routes>
          </AuthProvider>
          
        </BrowserRouter>
        
        
      </div>
    </div>
  );
}

export default App;
