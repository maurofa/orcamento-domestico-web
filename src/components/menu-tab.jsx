import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React from "react";
import { useLocation } from 'react-router-dom';

function LinkTab(props) {
  return (
    <Tab
      component="a"
      {...props}
    />
  );
}

const MenuTab = () => {

  const [value, setValue] = React.useState("/");

  let location = useLocation();

  React.useEffect(() => {
    setValue(location.pathname);
  }, [location])

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={value}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="menu principal"
        centered
      >
        <LinkTab value="/historico" href="/historico" label="HISTÓRICO" />
        <LinkTab value="/" href="/" label="ATUAL" />
        <LinkTab value="/futuro" href="/futuro" label="FUTURO"  />
      </Tabs>
    </Box>
  );
}

export default MenuTab
