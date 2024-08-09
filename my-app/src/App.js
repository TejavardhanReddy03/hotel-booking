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
import Placespage from './components/Placespage';
import PlacesFormPage from './components/PlacesFormPage';
import PlacePage from './components/PlacePage';
import BookingPage from './components/BookingPage';
import BookingsPage from './components/BookingsPage';
 
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
      <Route path="/account/places" element={<Placespage />} />
      <Route path="/account/places/new" element={<PlacesFormPage />} />
      <Route path="/account/places/:id" element={<PlacesFormPage />} />
      <Route path="/place/:id" element={<PlacePage />} />
      <Route path="/account/bookings" element={<BookingsPage />} />
      <Route path="/account/bookings/:id" element={<BookingPage />} />
      </Route>
      
    </Routes>
    </Usercontextprovider>

  );
}

export default App;
