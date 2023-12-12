import Grid from '@mui/material/Unstable_Grid2';
import { Outlet } from 'react-router-dom';
import MenuTab from '../components/menu-tab';

export default function Root({ children }) {
  return (
    <>
      <Grid container direction="column" justifyContent="center" alignItems="stretch" spacing={4}>
        <Grid display="flex" justifyContent="center" alignItems="center">
          <header>
            <h1>
              ORÇAMENTO DOMÉSTICO
            </h1>
            <MenuTab />
          </header>
        </Grid>
        <Grid>
          <Outlet />
        </Grid>
      </Grid>
    </>
  );
}
