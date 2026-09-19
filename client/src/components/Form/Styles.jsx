import { styled } from '@mui/material/styles';

export const StyledContainer = styled('div')(({ theme }) => ({
  '& .MuiTextField-root': {
    margin: theme.spacing(1),
  },
}));

export const StyledPaper = styled('div')({
  padding: '20px 20px 24px',
  backgroundColor: '#fff',
  // width:100% plus padding overflowed the column without this.
  boxSizing: 'border-box',
  borderRadius: '15px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e0e0e0',
  width: '100%',
  maxWidth: '500px',
  margin: '0 auto',
});

// One gap value drives the whole form so every control is evenly spaced,
// including the button pair at the bottom.
export const StyledForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  '& .MuiTextField-root': {
    margin: 0,
  },
});

export const fileInputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px dashed #c4c4c4',
  boxSizing: 'border-box',
};

export const buttonSubmitStyle = {
  marginTop: '4px',
};
