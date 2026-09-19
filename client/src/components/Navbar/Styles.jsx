import { styled } from '@mui/material/styles';
import { AppBar, Typography } from '@mui/material';

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  borderRadius: 15,
  margin: '30px 0',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 40px',
  gap: '12px',
  // The brand and profile can't sit side by side on a phone; left as a fixed
  // row they pushed the document wider than the viewport and made the whole
  // page scroll sideways.
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    padding: '16px 20px',
    margin: '16px 0',
  },
}));

export const StyledHeading = styled(Typography)(({ theme }) => ({
  color: 'rgba(0,183,255, 1)',
  textDecoration: 'none',
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.5rem',
  },
}));

export const StyledImage = styled('img')({
  marginLeft: '15px',
});
