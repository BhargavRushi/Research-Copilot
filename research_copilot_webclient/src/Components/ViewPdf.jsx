import {useEffect, useRef} from 'react';
import "../Styles/pdfViewer.css";
import Typography from '@mui/material/Typography';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import noDataIcon from "../Images/noData.svg";

function PDFViewer(props) {
  const isFirstRender = useRef(true); // Ref to track the first render

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // Skip the first run
      return;
    }
    
    if (props.openPdfViewer) {
      props.setPdfViewerSize(12);
      props.setMainContentSize(20);
    } else {
      props.setPdfViewerSize(1);
      props.setMainContentSize(30);
    }
  }, [props.openPdfViewer]);

  const togglePdfViewer = () => {
    props.setOpenPdfViewer((prevState) => !prevState); // Safely toggle the state
  };

  return (
    <>
      <div className='pdfViewerContainer'>
        {
          !props.openPdfViewer ? (
            <div style={{display: "flex", justifyContent: "center"}}>
              <KeyboardDoubleArrowRightIcon sx={{alignSelf: "center"}} onClick={togglePdfViewer}/>
            </div>
          ) : (
            <div className='pdfViewerContent'>
            <div className='pdfViewerHeader'>
              <Typography variant="h7">Paper Viewer</Typography>
              <KeyboardDoubleArrowRightIcon sx={{alignSelf: "center"}} onClick={togglePdfViewer}/>
            </div>
            {
              props.currentPdf != "" ? (
                <div className='pdfContent'>
                  <iframe
                    title='research paper viewer'
                    src={props.currentPdf}
                    width="100%"
                    style={{ border: 'none', height: "74.5vh"}}
                ></iframe>
                </div>
              ) : (
                <div
                        style={{
                          justifyContent: 'center', 
                          alignItems: 'center',     
                          verticalAlign: 'middle'
                        }}
                        className='pdfContent noDataIconDiv'
                      >
                        <img
                          src={noDataIcon}
                          alt="Centered"
                          style={{ display: 'block', margin: '0 auto' }}
                          />
                        <p style={{opacity: "0.5"}}>No Data Available</p>
                      </div>
                    )
                  }
              </div>
          )
        }
      </div>
    </>
  )
}

export default PDFViewer;
