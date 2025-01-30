import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Button } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Main from './Main';
import InputParams from './InputParams';
import Avatar from '@mui/material/Avatar';
import { useState } from 'react';
import appIcon from "../Images/analytics.png";
import Loader from './Loader';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

export default function Sidenav() {
  const [searchData, setSearchData] = useState([]);
  const [currentPdf, setCurrentPdf] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);

  return (
    <>
    <Loader loading = {loading}/>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" elevation={4} sx={{backgroundColor : "#092E5D", color: "#bfc8d6"}}>
        <Toolbar>
          <img src={appIcon} alt='...' height={30} width={30} style={{marginRight: "10px"}}/>
          <Typography variant="h7" component="div" sx={{ flexGrow: 1 }}>
            Research Matricks
          </Typography>
          <Avatar sx={{bgcolor: "#257dd4"}}>U</Avatar>
          <Button color="inherit" sx={{color: "#bfc8d6"}}>User</Button>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#f1f1f1", height: "100vh"}}>
        <DrawerHeader />
        <InputParams setSearchData = {setSearchData} setLoading = {setLoading} setFiles = {setFiles}/>
        <Main searchData = {searchData} setSearchData = {setSearchData} currentPdf = {currentPdf} setCurrentPdf = {setCurrentPdf} setLoading = {setLoading} files = {files} setFiles = {setFiles}/>
      </Box>
    </Box>
    </>
  );
}
