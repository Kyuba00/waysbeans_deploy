import { useContext, useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom'


import './App.css';
import Navibar from './components/navibar/Navibar';
import { UserContext } from './context/userContext';
import LandingPage from './pages/LandingPage';

import { API, setAuthToken } from './config/api';
import CreateProductPage from './pages/CreateProductPage';
import DetailProductPage from './pages/DetailProductPage';
import ProfilePage from './pages/ProfilePage';
import TransactionListPage from './pages/TransactionListPage';
import { PrivateRouteAdmin, PrivateRouteLogin, PrivateRouteUser } from './components/PrivateRoute';
import ProductListPage from './pages/ProductListPage';
import UpdateProductPage from './pages/UpdateProductPage';
import CartPage from './pages/CartPage';


function App() {
  let navigate = useNavigate();
  const [state, dispatch] = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    if (!isLoading) {
      if (state.isLogin === false) {
        navigate('/');
      }
    }
    window.dispatchEvent(new Event("badge"));
  }, [isLoading])





  const checkUser = async () => {
    try {
      const response = await API.get('/check-auth');
      //Get user data
      let payload = response.data.data;
      //Get Token from local storage
      payload.token = localStorage.token;
      dispatch({
        type: 'USER_SUCCESS',
        payload,
      });
      setIsLoading(false)
    } catch (error) {
      dispatch({
        type: 'AUTH_ERROR',
      });
      setIsLoading(false)
    }
  };


  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      checkUser();
      window.dispatchEvent(new Event("badge"));
    } else {
      setIsLoading(false);
    }

  }, []);
  return (
    <>

      {isLoading ? null :
        <>
          <Navibar />
          {/* <lottie animationData={coffe} /> */}
          <Routes>
            <Route exact path='/' element={<LandingPage />} />
            <Route path="/product/:id" element={<DetailProductPage />} />
            <Route element={<PrivateRouteLogin />}>
              <Route element={<PrivateRouteUser />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/cart" element={<CartPage />} />
              </Route>
              <Route element={<PrivateRouteAdmin />}>
                <Route path="/list-transaction" element={<TransactionListPage />} />
                <Route path="/add-product" element={<CreateProductPage />} />
                <Route path="/update-product/:id" element={<UpdateProductPage />} />
                <Route path="/list-product" element={<ProductListPage />} />
              </Route>
            </Route>
          </Routes>
        </>
      }
    </>

  );
}

export default App;
