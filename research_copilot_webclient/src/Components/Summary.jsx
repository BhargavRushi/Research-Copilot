import React from 'react'
import "../Styles/summary.css";
import noDataIcon from "../Images/noData.svg";
import ReactMarkdown from "react-markdown";

function Summary(props) {
  console.log(props.summary);
  return (
    <div className='summary-content'>
        {
          props.summary != undefined && props.summary != "" ? (
            <ReactMarkdown>{props.summary}</ReactMarkdown>
          ) : (
            <div
              style={{
                justifyContent: 'center', 
                alignItems: 'center',     
                verticalAlign: 'middle',
                display: 'flex',
                flexDirection: 'column',
                height: "65vh"
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

export default Summary;
