import { TextField, Grid, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Input = ({ name, label, value, handleChange, autoFocus, type, handleShowPassword, half, isPassword }) => {
  return (
    <Grid size={{ xs: 12, sm: half ? 6 : 12 }}>
        <TextField
        name={name}
        value={value ?? ''}
        onChange={handleChange}
        label={label}
        variant="outlined"
        required
        fullWidth
        autoFocus={autoFocus}
        type={type}
        autoComplete={name === 'password' ? 'current-password' : name === 'confirmPassword' ? 'new-password' : name}
        slotProps={isPassword ? {
            input: {
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={handleShowPassword} edge="end" aria-label="toggle password visibility">
                            {type === 'password' ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                ),
            },
        } : undefined}
        />
    </Grid>
  )
}
export default Input
