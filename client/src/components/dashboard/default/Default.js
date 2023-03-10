import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import NewUsersLastWeek from './NewUsersLastWeek';

import NumberUsersPerPlan from './NumberUsersPerPlan';

function DefaultContent() {

  return (
    <Container width="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={2}>

        <Grid item xs={12} md={7} lg={8}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 350,
            }}
            >
            <NewUsersLastWeek />
          </Paper>
        </Grid>

        <Grid item xs={12} md={5} lg={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 350,
            }}
          >
            <NumberUsersPerPlan />
          </Paper>
        </Grid>

      </Grid>
    </Container>
  );
}

export default function Default() {
  return <DefaultContent />;
}
