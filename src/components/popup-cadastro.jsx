import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const PopupCadastro = ({ open, onClose, onSubmit, conteudo, titulo }) => {

  return (
    <Modal open={open} onClose={onClose} >
      <Box sx={style} spacing={2}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {titulo}
        </Typography>
        {conteudo}
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" >
          <Button variant='contained' color='secondary' onClick={onClose} >Cancela</Button>
          <Button variant="contained" endIcon={<SendIcon />} onClick={onSubmit} >Confirma</Button>
        </Stack>
      </Box>
    </Modal>
  );
}

PopupCadastro.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  conteudo: PropTypes.string.isRequired,
  titulo: PropTypes.string.isRequired,
}

export default PopupCadastro;
