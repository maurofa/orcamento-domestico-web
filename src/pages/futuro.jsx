import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import { Box, FormControl, Grid, IconButton, LinearProgress, MenuItem, Paper, TextField, Typography } from "@mui/material";
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from "react";
import PopupCadastro from "../components/popup-cadastro";
import PopupConfirmacao from '../components/popup-confirmacao';
import Objetivos, { adicionaObjetivoNaBase, alteraObjetivoNaBase, concluiObjetivoNaBase } from "../services/objetivos.service";

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

const newObjetivo = () => ({
  descricao: '',
  valor: '',
  dataAlvo: '',
  valorAlocado: '',
  tipoOperacao: 'I',
});

const newReserva = () => ({
  objetivo: {},
  valor: ''
})

const Futuro = () => {
  const [openCadastroObjetivo, setOpenCadastroObjetivo] = React.useState(false);
  const [openAlteracaoObjetivo, setOpenAlteracaoObjetivo] = React.useState(false);
  const [openConclusaoObjetivo, setOpenConclusaoObjetivo] = React.useState(false);
  const [openNotificacao, setOpenNotificacao] = React.useState(false);
  const [openAlocaReserva, setOpenAlocaReserva] = React.useState(false);
  const [openFazRetirada, setOpenFazRetirada] = React.useState(false);
  const [objetivo, setObjetivo] = React.useState(newObjetivo());
  const [reserva, setReserva] = React.useState(newReserva());
  const [titulo, setTitulo] = React.useState("");
  const [objetivos, setObjetivos] = React.useState(Objetivos());
  const [mensagemNotificacao, setMensagemNotificacao] = React.useState("");

  const adicionaObjetivo = (event) => {
    setTitulo("Adicione um Objetivo");
    event.preventDefault();
    setOpenCadastroObjetivo(true);
  }

  const alocaReservas = (event) => {
    event.preventDefault();
    setTitulo("Aloca Reservas para um objetivo");
    setOpenAlocaReserva(true);
  }

  const fazRetirada = (event) => {
    event.preventDefault();
    setTitulo("Faz retirada de um objetivo");
    setOpenFazRetirada(true);
  }

  const alteraObjetivo = (event, objetivo) => {
    event.preventDefault();
    objetivo.tipoOperacao = 'A';
    setObjetivo(objetivo);
    setTitulo("Faz a alteração do objetivo " + objetivo.descricao);
    setOpenAlteracaoObjetivo(true);
  }

  const concluiObjetivo = (event, objetivo) => {
    event.preventDefault();
    objetivo.tipoOperacao = 'C';
    setObjetivo(objetivo);
    setTitulo("O objetivo '" + objetivo.descricao + "' tem um valor alocado de R$ " + objetivo.valorAlocado + ". Ao concluir o objetivo, o valor será incluído no mês atual como crédito.");
    setOpenConclusaoObjetivo(true);
  }

  const handleClose = () => {
    setObjetivo(newObjetivo());
    setOpenCadastroObjetivo(false);
    setOpenAlteracaoObjetivo(false);
    setOpenConclusaoObjetivo(false);
  }

  const handleCloseReserva = () => {
    setObjetivo(newObjetivo());
    setReserva(newReserva());
    setOpenAlocaReserva(false);
    setOpenFazRetirada(false);
  }

  const handleSubmit = () => {
    // eslint-disable-next-line default-case
    switch (objetivo.tipoOperacao) {
      case 'I':
        adicionaObjetivoNaBase(objetivo);
        setMensagemNotificacao("Objetivo adicionado na base de dados!");
        break;
      case 'A':
        alteraObjetivoNaBase(objetivo);
        setMensagemNotificacao("Objetivo alterado na base de dados!");
        break;
      case 'C':
        setObjetivos(concluiObjetivoNaBase(objetivo));
        setMensagemNotificacao("Objetivo concluído na base de dados!");
        break;
    }
    setOpenNotificacao(true);
    handleClose();
  }

  const handleSubmitReserva = () => {
    const objetivo =reserva.objetivo;
    if (reserva.valor < 0) {
      objetivo.valorAlocado -= reserva.valor;
      setMensagemNotificacao("Retirada realizada com sucesso!");
    } else if (reserva.valor > 0) {
      objetivo.valorAlocado += reserva.valor;
      setMensagemNotificacao("Alocação de reservas realizada com sucesso!");
    }
    alteraObjetivoNaBase(objetivo);
    setOpenNotificacao(true);
    handleCloseReserva();
  }

  const handleCloseNotificacao = () => {
    setOpenNotificacao(false);
    setMensagemNotificacao("");
  }

  const getConteudoAdicionaObjetivo = () => (
    <Grid
      direction="column"
      component="form"
      noValidate
      autoComplete="off"
      spacing={2}
    >
      <Stack>
        <FormControl required >
          <TextField
            placeholder="Descrição do objetivo"
            name="descricao"
            label="Descrição do objetivo"
            defaultValue={objetivo.descricao}
            onChange={(event) => setObjetivo({ ...objetivo, descricao: event.target.value })}
          />
        </FormControl>
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="stretch">
        <FormControl xs={8} required >
          <DemoItem label="Data alvo">
            <DatePicker
              format='DD/MM/YYYY'
              onChange={(newValue) => setObjetivo({ ...objetivo, dataAlvo: newValue })}
              defaultValue={dayjs(objetivo.dataAlvo)}
              name="dataAlvo"
            />
          </DemoItem>
        </FormControl>
        <FormControl xs={4} required >
          <TextField
            placeholder="Valor da meta"
            name="valorMeta"
            label="Valor da meta"
            type='number'
            InputLabelProps={{
              shrink: true,
            }}
            defaultValue={objetivo.valor}
            onChange={(event) => setObjetivo({ ...objetivo, valor: +event.target.value })}
          />
        </FormControl>
      </Stack>
    </Grid>
  );

  const getConteudoAlocaReservas = () => (
    <Grid
      direction="column"
      component="form"
      noValidate
      autoComplete="off"
      spacing={2}
    >
      <Stack>
        <FormControl xl='6' required>
          <InputLabel htmlFor="objetivoSelect">Objetivo</InputLabel>
          <Select
            required
            defaultValue={reserva.objetivo}
            id="objetivoSelect"
            name='objetivoSelect'
            label="Objetivo"
            onChange={(event) => setReserva({...reserva, objetivo: event.target.value})}
          >
            {objetivos.map(objetivo => (
              <MenuItem value={objetivo}>{objetivo.descricao}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl xl='6' required >
          <TextField
            placeholder="Valor que será alocado"
            name="valorAlocado"
            label="Valor que será alocado"
            type='number'
            InputLabelProps={{
              shrink: true,
            }}
            defaultValue={reserva.valor}
            onChange={(event) => setReserva({ ...reserva, valor: +event.target.value })}
          />
        </FormControl>
      </Stack>
    </Grid>
  );

  const getConteudoFazRetirada = () => (
    <Grid>
      <Stack>
        <FormControl xl='6' required>
          <InputLabel htmlFor="objetivoSelect">Objetivo</InputLabel>
          <Select
            required
            defaultValue={reserva.objetivo}
            id="objetivoSelect"
            name='objetivoSelect'
            label="Objetivo"
            onSelect={(objetivo) => setReserva({...reserva, objetivo: objetivo})}
          >
            {objetivos.map(objetivo => (
              <MenuItem value={objetivo}>{objetivo.descricao}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl xl='6' required >
          <TextField
            placeholder="Valor que será retirado"
            name="valorRetirado"
            label="Valor que será retirado"
            type='number'
            InputLabelProps={{
              shrink: true,
            }}
            defaultValue={reserva.valor}
            onChange={(event) => setReserva({ ...reserva, valor: -event.target.value })}
          />
        </FormControl>
      </Stack>
    </Grid>
  );

  const getConteudoAlteraObjetivo = () => (
    <Grid>
      <FormControl fullWidth required >
          <TextField
            placeholder="Valor alvo do Objetivo"
            name="valorAlvo"
            label="Novo valor do objetivo"
            type='number'
            InputLabelProps={{
              shrink: true,
            }}
            defaultValue={objetivo.valor}
            onChange={(event) => setObjetivo({ ...objetivo, valor: +event.target.value })}
          />
        </FormControl>
    </Grid>
  );

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='en-gb'>
        <Grid direction="column" justifyContent="center" alignItems="stretch" spacing={2} >
          <Paper direction="row" justifyContent="center" alignItems="center">
            <img src={require("../assets/alvo.jpeg")} alt="Flexas no alvo" />
          </Paper>
          <Grid spacing={2} direction="column" justifyContent="center" alignItems="stretch">
            {objetivos.map(objetivo => (
                <Paper elevation={2} sx={{ minHeight: 100 }} spacing={2} direction="row" justifyContent="center" alignItems="center">
                  <Grid xs={2}>{objetivo.descricao}</Grid>
                  <Grid xs={8} >
                    <LinearProgressWithLabel value={objetivo.valorAlocado * 100 / objetivo.valor} />
                  </Grid>
                  <Grid xs={2}>
                    <IconButton onClick={(event) => alteraObjetivo(event, objetivo)}><EditIcon /></IconButton>
                    <IconButton onClick={(event) => concluiObjetivo(event, objetivo)}><DoneIcon /></IconButton>
                  </Grid>
                </Paper>
              ))}
              <div></div>
          </Grid>
          <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" >
            <Button variant='contained' onClick={(event) => adicionaObjetivo(event)} >Adiciona Objetivo</Button>
            <Button variant="contained" onClick={(event) => alocaReservas(event)} >Aloca Reservas</Button>
            <Button variant="contained" onClick={(event) => fazRetirada(event)} >Faz Retirada</Button>
          </Stack>
        </Grid>
        <PopupCadastro
          open={openCadastroObjetivo}
          conteudo={getConteudoAdicionaObjetivo()}
          titulo={titulo}
          onClose={handleClose}
          onSubmit={handleSubmit}
        />
        <PopupCadastro
          open={openAlteracaoObjetivo}
          conteudo={getConteudoAlteraObjetivo()}
          titulo={titulo}
          onClose={handleClose}
          onSubmit={handleSubmit}
        />
        <PopupConfirmacao
          open={openConclusaoObjetivo}
          onClose={() => handleClose()}
          onConfirma={handleSubmit}
          titulo={titulo}
          subTitulo="Esta operação não pode ser desfeita."
        />
        <PopupCadastro
          open={openAlocaReserva}
          conteudo={getConteudoAlocaReservas()}
          titulo={titulo}
          onClose={handleCloseReserva}
          onSubmit={handleSubmitReserva}
        />
        <PopupCadastro
          open={openFazRetirada}
          conteudo={getConteudoFazRetirada()}
          titulo={titulo}
          onClose={handleCloseReserva}
          onSubmit={handleSubmitReserva}
        />
        <Snackbar
          open={openNotificacao}
          autoHideDuration={5000}
          onClose={handleCloseNotificacao}
          message={mensagemNotificacao}
        />
      </LocalizationProvider>
    </>
  );
}

export default Futuro;
