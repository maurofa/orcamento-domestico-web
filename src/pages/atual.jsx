import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { CssBaseline } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import * as React from 'react';
import PopupCadastro from '../components/popup-cadastro';
import PopupConfirmacao from '../components/popup-confirmacao';
import getGrupos from '../services/grupo.service';
import getLancamentos, { atualizaTabelaComExclusao, atualizaTabelaComLancamento } from '../services/lancamentos.service';

const newLancamento = () => ({
  subGrupoId: '',
  descricao: '',
  dataDaCompra: '',
  valor: '',
  ehCredito: true,
  compraNoDebito: false,
  quantidadeDeParcelas: '',
  dataDePagamento: ''
});

const Atual = () => {
  const [openCadastro, setOpenCadastro] = React.useState(false);
  const [lancamento, setLancamento] = React.useState(newLancamento());
  const [openNotificacaoLancamento, setOpenConfirmacaoLancamento] = React.useState(false);
  const [openConfirmacaoExclusao, setOpenConfirmacaoExclusao] = React.useState(false);
  const [titulo, setTitulo] = React.useState("");
  const [rows, setRows] = React.useState([]);
  const [grupos, setGrupos] = React.useState([]);

  React.useEffect(() => {
    getLancamentos().then(lancamentos => setRows(lancamentos));
    getGrupos().then(grupos => setGrupos(grupos));
  }, []);

  const cadastraLancamento = (event) => {
    event.preventDefault();
    setTitulo("Cadastro de novo Lançamento");
    setOpenCadastro(true);
  }

  const adicionaNovoLancamento = (lancamento) => {
    atualizaTabelaComLancamento(lancamento, rows).then(lancamentos => {
      setRows(lancamentos);
      setLancamento(newLancamento());
      setOpenCadastro(false);
      setOpenConfirmacaoLancamento(true);
    });
  }

  const handleCloseCadastroLancamento = () => {
    setOpenCadastro(false);
    setLancamento(newLancamento());
  }

  const handleCloseNotificacaoLancamento = () => {
    setOpenConfirmacaoLancamento(false);
  }

  const handleCloseConfirmacaoExclusao = () => {
    setOpenConfirmacaoExclusao(false);
  }

  const alteraLancamento = (event, lancamentoAtual) => {
    event.preventDefault();
    setLancamento(lancamentoAtual);
    setTitulo("Alteração de um Lançamento existente");
    setOpenCadastro(true);
  }

  const deletaLancamento = (event, lancamentoAtual) => {
    event.preventDefault();
    setLancamento(lancamentoAtual);
    setOpenConfirmacaoExclusao(true);
  }

  const excluirLancamento = (lancamento) => {
    atualizaTabelaComExclusao(lancamento, rows)
      .then(lancamentos => {
        setRows(lancamentos);
        setOpenConfirmacaoExclusao(false);
        setLancamento(newLancamento());
      });
  }

  const getConteudo = () => {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='en-gb'>
        <Grid
          direction="column"
          component="form"
          noValidate
          autoComplete="off"
          spacing={2}
        >
          <Stack direction="row" spacing={2} >
            <FormControl xl='6' required>
              <InputLabel htmlFor="subGroupSelect">Subgrupo</InputLabel>
              <Select
                required
                native
                defaultValue={lancamento.subGrupoId}
                id="subgrupoSelect"
                name='subgrupoSelect'
                label="Grouping"
                onChange={(event) => setLancamento({ ...lancamento, subGrupoId: +event.target.value })}
              >
                <option aria-label="None" value="" />
                {grupos.map(grupo => (
                  <optgroup label={grupo.descricao}>
                    {grupo.subGrupos.map(subGrupo => (
                      <option value={subGrupo.id}>{subGrupo.descricao}</option>
                    ))}
                  </optgroup>
                ))}
              </Select>
            </FormControl>
            <TextField
              xl='6'
              placeholder="Descrição"
              name="descricao"
              label="Descrição"
              required
              defaultValue={lancamento.descricao}
              onChange={(event) => setLancamento({ ...lancamento, descricao: event.target.value })}
            />
          </Stack>
          <Stack direction="row" spacing={1} justifyContent="center" alignItems="stretch" >
            <FormControl xl='5'>
              <DemoItem label="Data da compra">
                <DatePicker
                  format='DD/MM/YYYY'
                  onChange={(newValue) => setLancamento({ ...lancamento, dataDaCompra: newValue })}
                  defaultValue={dayjs(lancamento.dataDaCompra)}
                  name="dataDaCompra"
                />
              </DemoItem>
            </FormControl>
            <FormControl xl='4' >
              <TextField
                placeholder="Valor do lançamento"
                name="valor"
                label="Valor do lançamento"
                required
                type='number'
                InputLabelProps={{
                  shrink: true,
                }}
                defaultValue={lancamento.valor * (lancamento.valor < 0 ?  -1 : 1)}
                onChange={(event) => setLancamento({ ...lancamento, valor: +event.target.value })}
              />
            </FormControl>
            <FormControl xl='3'>
              <FormControlLabel
                control={
                  <Switch
                    name='ehCredito'
                    defaultChecked
                    checked={lancamento.ehCredito}
                    inputProps={{ 'aria-label': 'controlled' }}
                    onChange={(event) => setLancamento({ ...lancamento, ehCredito: event.target.checked })}
                  />
                }
                label={lancamento.ehCredito ? 'É Crédito' : 'É Débito'}
              />
            </FormControl>
          </Stack>
          <Stack direction="row" spacing={1} justifyContent="center" alignItems="stretch">
            <FormControl xl='3'>
              <FormControlLabel
                control={
                  <Switch
                    disabled={lancamento.ehCredito}
                    name='compraNoDebito'
                    checked={lancamento.compraNoDebito}
                    inputProps={{ 'aria-label': 'controlled' }}
                    onChange={(event) => setLancamento({ ...lancamento, compraNoDebito: event.target.checked })}
                  />
                }
                label={lancamento.compraNoDebito ? 'Compra no débito' : 'Compra parcelada'}
              />
            </FormControl>
            <FormControl xl='4'>
              <TextField
                disabled={lancamento.compraNoDebito}
                placeholder="Quantidade de Parcelas"
                name="quantidadeDeParcelas"
                label="Quantidade de Parcelas"
                required
                type='number'
                InputLabelProps={{
                  shrink: true,
                }}
                defaultValue={lancamento.quantidadeDeParcelas}
                onChange={(event) => setLancamento({ ...lancamento, quantidadeDeParcelas: event.target.value })}
              />
            </FormControl>
            <FormControl xl='5'>
              <DemoItem label="Data do primeiro pagamento">
                <DatePicker
                  disabled={lancamento.compraNoDebito}
                  format='DD/MM/YYYY'
                  onChange={(newValue) => setLancamento({ ...lancamento, dataDePagamento: newValue })}
                  defaultValue={dayjs(lancamento.dataDePagamento)}
                  name="dataDePagamento"
                />
              </DemoItem>
            </FormControl>
          </Stack>
        </Grid>
      </LocalizationProvider>
    );
  }

  const getConteudoExclusao = () => {
    return (
      <div>Lançamento '{lancamento.descricao}' no valor de '{lancamento.valor}'.</div>
    );
  }

  return (
    <>
      <CssBaseline />
      <Grid container direction="column" justifyContent="center" alignItems="stretch">
        <Paper>
          <TableContainer sx={{ height: "550px" }}>
            <Table stickyHeader aria-label="tabela com os lançamentos do mês" sx={{height: "max-content"}}>
              <TableHead>
                <TableRow>
                  <TableCell>Tipo de Despesa</TableCell>
                  <TableCell>Data da Compra</TableCell>
                  <TableCell>Data do Pagamento</TableCell>
                  <TableCell>Descrição do Lançamento</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Saldo</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow sx={{backgroundColor: row.valor < 0 ? 'pink' : 'lightblue'}}>
                    <TableCell>{row.subGrupo.descricao}</TableCell>
                    <TableCell>{row.dataDaCompra.toLocaleDateString()}</TableCell>
                    <TableCell>{row.dataDePagamento?.toLocaleDateString()}</TableCell>
                    <TableCell>{row.descricao}</TableCell>
                    <TableCell>{row.valor}</TableCell>
                    <TableCell>{row.saldo}</TableCell>
                    <TableCell>
                      <IconButton onClick={(event) => alteraLancamento(event, row)}><EditIcon /></IconButton>
                      <IconButton onClick={(event) => deletaLancamento(event, row)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Stack direction="column" alignItems="center" >
          <Tooltip title="faz lançamento">
            <IconButton onClick={(event) => cadastraLancamento(event)} aria-label='faz lançamento' size='large'>
              <AddCircleIcon fontSize='large' />
            </IconButton>
          </Tooltip>
        </Stack>
      </Grid>
      <PopupCadastro
        open={openCadastro}
        onClose={() => handleCloseCadastroLancamento()}
        onSubmit={() => adicionaNovoLancamento(lancamento)}
        titulo={titulo}
        conteudo={getConteudo()}
      />
      <Snackbar
        open={openNotificacaoLancamento}
        autoHideDuration={5000}
        onClose={handleCloseNotificacaoLancamento}
        message="Lançamento adicionado com sucesso!"
      />
      <PopupConfirmacao
        open={openConfirmacaoExclusao}
        onClose={() => handleCloseConfirmacaoExclusao()}
        onConfirma={() => excluirLancamento(lancamento)}
        titulo="Exclusão do Lançamento"
        subTitulo="Esta operação não pode ser desfeita."
        conteudo={getConteudoExclusao()}
      />
    </>
  );
}

export default Atual;
