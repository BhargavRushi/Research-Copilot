import {useState} from 'react';
import Box from '@mui/material/Box';
import { Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ListCard from './ListCard';
import MainContentTabs from './MainContentTabs';
import PDFViewer from './ViewPdf';

function Main(props) {
  const [summary, setSummary] = useState("");
  const [mainContentSize, setMainContentSize] = useState(30);
  const [pdfViewerSize, setPdfViewerSize] = useState(1);
  const [openPdfViewer, setOpenPdfViewer] = useState(false);

  return (
    <Box>
        <Grid container spacing={2} columns={32} sx={{margin: "0 20px"}}>
          <Grid size={7}>
            <ListCard searchData = {props.searchData} setSearchData = {props.setSearchData} setCurrentPdf = {props.setCurrentPdf} setSummary = {setSummary} setOpenPdfViewer = {setOpenPdfViewer} setLoading = {props.setLoading} files = {props.files} setFiles = {props.setFiles}/>
          </Grid>
          <Grid size={25}>
            <Grid container spacing={2} columns={32} style={{marginTop: "22px"}}>
                <Grid size={mainContentSize}>
                    <Paper elevation={4}>
                        <MainContentTabs summary = {summary} searchData = {props.searchData}/>
                    </Paper>
                </Grid>
                <Grid size={pdfViewerSize}>
                  <Paper elevation={4}>
                    <PDFViewer currentPdf = {props.currentPdf} setPdfViewerSize = {setPdfViewerSize} setMainContentSize = {setMainContentSize} openPdfViewer = {openPdfViewer} setOpenPdfViewer={setOpenPdfViewer}/>
                  </Paper>
                </Grid>
            </Grid>
          </Grid>
        </Grid>
    </Box>  
  )
}

export default Main;
