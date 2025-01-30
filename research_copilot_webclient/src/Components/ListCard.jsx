import "../Styles/listCard.css";
import Button from '@mui/material/Button';
import { useState, useEffect } from "react";
import { Paper } from '@mui/material';
import noDataIcon from "../Images/noData.svg";

function ListCard(props) {
  const [includedPapers, setIncludedPapers] = useState([]);
  const [currentFiles, setCurrentFiles] = useState([]);

  useEffect(() => {
    if (props.files.length > 0) {
      setCurrentFiles((prevFiles) => [...prevFiles, ...props.files]);  // Spread the array
    }
  }, [props.files]);

  const handleIncludeExcludePapers = (paperTitle, paperUrl) => {
    setIncludedPapers((prevItems) => {
      // Check if the item is already in the list
      if (prevItems.includes(paperUrl)) {
        // If it exists, remove the item from the list
        return prevItems.filter((i) => i !== paperUrl);
      } else {
        // If it doesn't exist, add the item to the list
        return [...prevItems, paperUrl];
      }
    });

    setCurrentFiles((prevItems) => {
      // Check if the paperTitle exists in the props.files
      const newFile = props.files.find(file => file.title === paperTitle);
    
      // If the file is found and the URL includes 'blob', add it to the current state
      if (newFile && paperUrl.includes("blob")) {
        // Check if the file is already in the prevItems list
        const existingFileIndex = prevItems.findIndex(item => item.title === paperTitle);
    
        // If the file already exists in the list, remove it
        if (existingFileIndex !== -1) {
          return prevItems.filter((item) => item.title !== paperTitle);
        } else {
          // If the file does not exist, add the new file to the list
          return [...prevItems, newFile];
        }
      } else {
        // If no condition is met, return the previous state unchanged
        return prevItems;
      }
    });
    
  };

  const handleGenerateSummary = async () => {
    props.setLoading(true);
    try {
        const formData = new FormData(); 
        for (let i = 0; i < currentFiles.length; i++) {
          formData.append("files", currentFiles[i]);
        }
        formData.append("web_urls", includedPapers.length > 0 ? includedPapers.join(",") : "");
        const response = await fetch('http://localhost:8000/Summarize_pdfs', {
          method: 'POST',
          body: formData
        });
  
        if (response.ok) {
          const jsonResponse = await response.json();
          console.log(jsonResponse);
          console.log(jsonResponse["raw"]);
          props.setSummary(jsonResponse["raw"]);
        } else {
          console.log('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    props.setLoading(false);
  };

  return (
    <div>
        <Paper elevation={4}>
            <div className='table-container'>
                <table>
                    <thead>
                        <th><input type='checkbox' /></th>
                        <th>Paper Title</th>
                        <th>Resource Venue</th>
                    </thead>
                    {
                        props.searchData.length ?  (
                            <tbody>
                                {
                                    props.searchData.map((item, index) =>  (
                                        <tr id={index}>
                                            <td onClick={() => handleIncludeExcludePapers(item.title,item.openAccessPdf.url)}><input type="checkbox" /></td>
                                            <td className='resultObj' style={{color: "#082f5d"}} onClick={() => {props.setCurrentPdf(item.openAccessPdf.url); props.setOpenPdfViewer(true)}}>{item.title}</td>
                                            <td>{item.venue}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        ) : (
                            <tbody>
                                <tr>
                                    <td colSpan="3" style={{ height: '60vh', verticalAlign: 'middle', borderBottom: "0", textAlign: "center" }}>
                                        <img
                                        src={noDataIcon}
                                        alt="Centered"
                                        style={{ display: 'block', margin: '0 auto' }}
                                        />
                                        <p style={{opacity: "0.5"}}>No Data Available</p>
                                    </td>
                                </tr>
                            </tbody>
                        )
                    }
                </table>
            </div>
        </Paper>
        <div style={{display: "flex", justifyContent: "flex-end"}}>
            <Button
                sx={{ borderColor: "#092E5D", color: "#092E5D" }}
                variant='outlined'
                onClick={() => {props.setSearchData([]); props.setSummary(""); props.setCurrentPdf(""); setIncludedPapers([]); props.setFiles([]); setCurrentFiles([])}}
            >
                Clear Data
            </Button>
            <Button
                sx={{ backgroundColor: "#092E5D", color: "#fafafa", marginLeft: "10px" }}
                onClick={handleGenerateSummary}
                >
                Generate Summary
            </Button>
        </div>
    </div>
  )
}

export default ListCard;

