import { styled } from '@mui/material/styles';
import { Card, CardMedia } from '@mui/material';

export const StyledCard = styled(Card)({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '15px',
  height: '100%',
  position: 'relative',
});

export const Media = styled(CardMedia)({
  height: 0,
  paddingTop: '56.25%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backgroundBlendMode: 'darken',
});

export const Overlay = styled('div')({
  position: 'absolute',
  top: '20px',
  left: '20px',
  color: 'white',
});

export const Overlay2 = styled('div')({
  position: 'absolute',
  top: '20px',
  right: '20px',
  color: 'white',
});

export const Details = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  margin: '20px 20px 0 20px',
});

export const CardActionsStyled = styled('div')({
  padding: '0 16px 8px 16px',
  display: 'flex',
  justifyContent: 'space-between',
  // Keeps the action row on the baseline when a card is stretched taller than
  // its content by a neighbour in the same grid row.
  marginTop: 'auto',
});