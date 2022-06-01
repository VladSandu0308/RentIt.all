import { BrowserRouter, Route, Routes, Switch} from 'react-router-dom';
import Login from './components/Login';
import { AuthProvider } from './context/UserAuthContext';

function App() {
  return (
    <div className="App">
      <div className='container-fluid homepage-bgimage'>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Login />}/>
            </Routes>
          </AuthProvider>
          
        </BrowserRouter>
        
        
      </div>
    </div>
  );
}

export default App;
