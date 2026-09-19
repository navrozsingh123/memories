import { Container } from '@mui/material';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import { Auth } from './components/Auth/Auth';

const App = () => {
    const user = useSelector((state) => state.auth.authData);

    return (
        <BrowserRouter>
            <Container maxWidth="lg">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Navigate to="/posts" replace />} />
                    <Route path="/posts" element={<Home />} />
                    <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/posts" replace />} />
                    <Route path="*" element={<Navigate to="/posts" replace />} />
                </Routes>
            </Container>
        </BrowserRouter>
    );
};

export default App;
