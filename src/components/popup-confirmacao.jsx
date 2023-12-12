import { Button, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const PopupConfirmacao = ({ open, onClose, onConfirma, titulo, subTitulo, conteudo }) => {

  return (
    <Modal open={open} onClose={onClose} >
      <Box sx={style}>
          <Typography
              variant="h6"
              component="h2"
          >
              {titulo}
          </Typography>
          <Typography sx={{ mt: 2 }}>
              {subTitulo}
          </Typography>
          {conteudo}
          <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" >
            <Button variant='contained' color='secondary' onClick={onClose} >Cancela</Button>
            <Button variant="contained" color='primary' onClick={onConfirma} >Confirma</Button>
          </Stack>
      </Box>
    </Modal>
  );
}

export default PopupConfirmacao;
