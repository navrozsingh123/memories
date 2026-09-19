import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import memories from '../../images/memories.png';
import { StyledAppBar, StyledHeading, StyledImage } from './Styles';
import { Avatar, Typography, Toolbar, Button } from '@mui/material';
import { LOGOUT } from '../../constants/actionTypes';

function Navbar() {
    const user = useSelector((state) => state.auth.authData);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {
        dispatch({ type: LOGOUT });
        navigate('/posts');
    };

    useEffect(() => {
        const token = user?.token;
        if (!token) return;

        // Tokens expire after an hour; drop the session as soon as one lapses
        // so the UI never shows a signed-in user the API will reject.
        try {
            const { exp } = jwtDecode(token);
            if (exp * 1000 < Date.now()) dispatch({ type: LOGOUT });
        } catch {
            dispatch({ type: LOGOUT });
        }
    }, [location, user?.token, dispatch]);

    const name = user?.result?.name ?? '';

    return (
        <StyledAppBar position="static" color="inherit">
            <div className="brandContainer" style={{ display: 'flex', alignItems: 'center' }}>
                <StyledHeading variant="h2" align="center" component={Link} to="/">
                    Memories
                </StyledHeading>
                <StyledImage src={memories} alt="memories" height="60" />
            </div>
            <Toolbar className="toolbar" disableGutters sx={{ minHeight: "auto" }}>
                {user ? (
                    <div className="profile" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Avatar className="purple" alt={name} src={user.result?.imageUrl}>
                            {name.charAt(0)}
                        </Avatar>
                        <Typography className="userName" variant="h6">
                            {name}
                        </Typography>
                        <Button variant="contained" color="secondary" className="logout" onClick={logout}>
                            Logout
                        </Button>
                    </div>
                ) : (
                    <Button variant="contained" color="primary" component={Link} to="/auth">
                        Sign In
                    </Button>
                )}
            </Toolbar>
        </StyledAppBar>
    )
}

export default Navbar
