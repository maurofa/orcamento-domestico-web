import { Box, Card, CardContent, Typography } from '@mui/material';
import * as React from 'react';
import getFrase from '../services/frases.service';


const Frases = () => {

  const [frase, setFrase] = React.useState("Temos que aproveitar nossa vida pois tudo é passageiro, até nós mesmos.");

  React.useEffect(() => getFrase().then(frase => setFrase(frase)), []);

  const card = (
    <React.Fragment>
      <CardContent>
        <Typography variant="h5" component="div">
          {frase}
        </Typography>
      </CardContent>
    </React.Fragment>
  );

  return (
    <Box sx={{minWidth: 600}} direction="column" justifyContent="center" >
      <Card variant='outlined'>{card}</Card>
    </Box>
  );
}

export default Frases;
