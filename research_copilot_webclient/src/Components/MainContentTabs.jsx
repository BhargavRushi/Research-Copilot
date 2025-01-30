import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Summary from './Summary';
import Chatbot from './Chatbot';
import VisualizeData from './VisualizeData';

export default function MainContentTabs(props) { 
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', backgroundColor: "#ffffff", height: '81vh' }}>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Summarize" style={{color: "#092E5D"}}/>
        <Tab label="Ask" style={{color: "#092E5D"}}/>
        <Tab label="Visualize" style={{color: "#092E5D"}}/>
      </Tabs>
      {value === 0 && <Summary summary = {props.summary}/>}
      {value === 1 && <Chatbot/>}
      {value === 2 && <VisualizeData searchData = {props.searchData} />}
    </Box>
  )
}
