import { Route,Routes } from 'react-router-dom';
import './App.css';
//import Header from './components/Header';
import Layout from './components/Layout';
import Indexpage from './components/Indexpage';
import Loginpage from './components/Loginpage';
import Register from './components/Register';
import Usercontextprovider from './components/Usercontextprovider';
import axios from 'axios';
import Account from './components/Account';
 
axios.defaults.baseURL='https://localhost:4000'
axios.defaults.withCredentials=true;
function App() {
  return (
    /*<div>

      <Header/>
    </div>*/
    <Usercontextprovider>
    <Routes>
      <Route path='/' element={<Layout/>}>
      <Route  index element={< Indexpage />}  />
      <Route  path='/login' element={< Loginpage />}  />
      <Route  path='/register' element={< Register />}  />
      <Route path="/account" element={<Account />} />
      </Route>
      
    </Routes>
    </Usercontextprovider>

  );
}

export default App;
