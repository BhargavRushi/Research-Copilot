import React, { useState } from 'react';
import "../Styles/chatbot.css";
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import TextField from '@mui/material/TextField';
import ReactMarkdown from "react-markdown";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isMessageProcessing, setIsMessageProcessing] = useState(false);

  // Handle user input
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const fetchData = async (url, queryParams = {}, options = {}) => {
    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = `${url}?${queryString}`;
    const response = await fetch(fullUrl, options);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return response.json();
  };

  const handleSendMessage = async () => {
    if (userInput.trim() !== '') {
      // Add user's message
      setMessages([...messages, { text: userInput, sender: 'user' }]);
      setUserInput('');
      
      // Show "Processing..." message
      setIsMessageProcessing(true);
      setMessages(prevMessages => [
        ...prevMessages,
        { text: "Processing...", sender: "bot", isProcessing: true }
      ]);

      // Fetch bot response
      const baseUrl = "http://localhost:8000/chat";
      const queryParams = { query: userInput };

      try {
        const responseData = await fetchData(baseUrl, queryParams, {
          method: "GET",
        });

        setMessages(prevMessages => [
          ...prevMessages.filter(msg => !msg.isProcessing), // Remove "Processing..." message
          { text: responseData["raw"], sender: 'bot' },
        ]);
      } catch (err) {
        console.log(err.message);
        setMessages(prevMessages => [
          ...prevMessages.filter(msg => !msg.isProcessing), // Remove "Processing..." message
          { text: "Error fetching response", sender: 'bot' },
        ]);
      } finally {
        setIsMessageProcessing(false);
      }
    }
  };

  return (
    <div className="chatbot">
      <div className="chatbox">
        <div className="messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender === 'bot' ? 'bot' : 'user'}`}
            >
              {message.sender === 'bot' ? (
                <ReactMarkdown>{message.text}</ReactMarkdown>
              ) : (
                message.text
              )}
            </div>
          ))}
        </div>
        <div className='inputContainer'>
          <TextField 
            placeholder='Type a message' 
            variant="outlined"  
            fullWidth
            value={userInput}
            rows={5}
            size='small'
            onChange={handleInputChange}
            onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
          />
          <div onClick={handleSendMessage} className='sendIconDiv'>
            <SendOutlinedIcon sx={{ fontSize: 30 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;