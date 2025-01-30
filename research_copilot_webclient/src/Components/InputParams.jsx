import {useState} from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import { Paper } from '@mui/material';
import SimpleSnackbar from './SnackBar';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

function InputFileUpload(props) {
    const handleUploadFiles = (event) => {
      const files = event.target.files;
      console.log(files);
      if (files.length > 0) {
        for (const file of files) {
          if (file.type == "application/pdf") {
            const fileURL = URL.createObjectURL(file);
            let fileData = {
              title : file.name,
              venue : "User Device",
              openAccessPdf : {
                url : fileURL
              }
            }
            props.setSearchData((prevData) => [...prevData, fileData]);
            props.setFiles((preFiles) => [...preFiles, file]);
          }
        }
      }
    }

    return (
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        sx={{backgroundColor:"#092E5D", color: "#fafafa"}}
      >
        Upload files
        <VisuallyHiddenInput
          type="file"
          accept="application/pdf"
          multiple
          sx={{backgroundColor:"#082f5d", color: "#fafafa"}}
          onChange={handleUploadFiles}
        />
      </Button>
    );
}

function InputParams(props) {
  const [researchTopic, setResearchTopic] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [severity, setSeverity] = useState("error");

  const fetchData = async (url, queryParams = {}, options = {}) => {
    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = `${url}?${queryString}`;
    const response = await fetch(fullUrl, options);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return response.json();
  };

  const handleSearchPaper = async () => {
    props.setLoading(true);
    if (researchTopic && minYear && maxYear) {
      const baseUrl = "http://localhost:8000/get_resources";
      const queryParams = {
        topic: researchTopic,
        min_year: minYear,
        max_year: maxYear,
        max_papers: 100
      };

      try {
        const responseData = await fetchData(baseUrl, queryParams, {
          method: "GET",
        });
        props.setSearchData(responseData);
      } catch (err) {
        console.log(err.message);
      }
    } else {
      let message = !researchTopic ? "Research paper topic field is manatory" : !minYear ? "Min year field is mandatory" : "Max year field is mandatory"
      setSnackBarMessage(message);
      setSeverity("error");
      setOpenSnackBar(true);
    }
    props.setLoading(false);
  }

  const handleClearSearch = () => {
    setResearchTopic("");
    setMinYear("");
    setMaxYear("");
  }

  return (
    <>
      <Paper elevation={5}>
        <Grid container spacing={2} columns={16} alignItems="center" justifyContent="space-between">
          <Grid item sx={{ flexGrow: 1 }}>
            <h4 style={{ marginLeft: "25px" }}>Smart Summarization</h4>
          </Grid>
          <Grid item sx={{ display: "flex", gap: "10px", alignItems: "center", marginRight: "25px"}}>
            <Grid item>
              <InputFileUpload setSearchData = {props.setSearchData} setFiles = {props.setFiles}/>
            </Grid>
            <Grid>
              <div style={{ height: "50px", width: "1px", backgroundColor: "#888" }}></div>
            </Grid>
            <Grid item>
              <TextField
                sx={{ backgroundColor: "#ececec" }}
                size="small"
                label="Research paper topic"
                variant="outlined"
                onChange={(e) => setResearchTopic(e.target.value)}
                value={researchTopic}
                required
              />
            </Grid>
            <Grid item>
              <TextField
                type="number"
                size="small"
                label="Min year"
                min="1900"
                max="2025"
                sx={{ backgroundColor: "#ececec" }}
                onChange={(e) => setMinYear(e.target.value)}
                value={minYear}
                required
              />
            </Grid>
            <Grid item>
              <TextField
                type="number"
                size="small"
                label="Max year"
                min="1900"
                max="2025"
                sx={{ backgroundColor: "#ececec" }}
                onChange={(e) => setMaxYear(e.target.value)}
                value={maxYear}
                required
              />
            </Grid>
            <Grid item>
              <Button
                sx={{ backgroundColor: "#092E5D", color: "#fafafa" }}
                onClick={handleSearchPaper}
                type="submit"
              >
                Search Papers
              </Button>
            </Grid>
            <Grid item>
              <Button
                sx={{ borderColor: "#092E5D", color: "#092E5D" }}
                onClick={handleClearSearch}
                variant='outlined'
                type='Button'
              >
                Clear Search
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <SimpleSnackbar openSnackBar = {openSnackBar} setOpenSnackBar = {setOpenSnackBar} message = {snackBarMessage} severity = {severity}/>
    </>
  )
}

export default InputParams;