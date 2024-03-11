// import React from 'react'

// export default function Footer() {
//   return (
//     <div className='bg-orange-300'>
//         <div className='container mx-auto flex flex-col md:flex-row justify-between items-center rounded-t-3xl'></div>
//         <span className='text-3xl text-white font-bold tracking-tight'>Jo3et</span>
//         <span className='text-gray-50 font-bold tracking-tight flex gap-4'>
//             <span> Privacy Policy</span>
//             <span> Terms of service </span>
//         </span>

//     </div>
//   )
// }

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function StickyFooter() {
  return (
    <ThemeProvider theme={defaultTheme}>
      {/* <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <CssBaseline /> */}
        {/* <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="sm">
          <Typography variant="h2" component="h1" gutterBottom>
            Sticky footer
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            {'Pin a footer to the bottom of the viewport.'}
            {'The footer will move as the main element of the page grows.'}
          </Typography>
          <Typography variant="body1">Sticky footer placeholder.</Typography>
        </Container> */}
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[200]
                : theme.palette.grey[800],
          }}
        >
          <Container maxWidth="sm">
            <Typography variant="body1">
              My sticky footer can be found here.
            </Typography>
            <Copyright />
          </Container>
        </Box>
      {/* </Box> */}
    </ThemeProvider>
  );
}