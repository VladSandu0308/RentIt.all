import { BrowserRouter, Route, Routes, Switch} from 'react-router-dom';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import Register from './components/Register';
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
              <Route path="/updateProfile" element={
              <PrivateRoute>
                <UpdateProfile />
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
