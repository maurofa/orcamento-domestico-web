import { Box, Grid, Stack, Typography } from "@mui/material";
import { PieChart } from '@mui/x-charts/PieChart';
import Frases from "../components/card-frase";
import { getHistoricoPorGrupo } from "../services/lancamentos.service";

const data = getHistoricoPorGrupo();

const size = {
  width: 800,
  height: 400,
};

const Historico = () => {
  return (
    <Grid direction="column" justifyContent="center" alignItems="stretch" spacing={2} >
      <Stack direction="row" width="100%" textAlign="center" spacing={2}>
        <Box flexGrow={1}>
          <Typography>Distribuição dos gastos por tipo</Typography>
          <PieChart
              series={[
              { data }
              ]}
            {...size}
          />
        </Box>
      </Stack>
      <Frases></Frases>
    </Grid>
  );
}

export default Historico;
