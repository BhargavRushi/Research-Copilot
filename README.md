# **Research Matricks**  

## **Installation and Setup Guide**  

### **Prerequisites**  
Ensure that all necessary dependencies and prerequisites for both the web server and web client are completed before proceeding.  

---

## **1️⃣ Installing and Running the Research Copilot Web Server**  

### **Installation Steps**  
1. Open a terminal or command prompt.  
2. Navigate to the **research_copilot_webserver** directory:  
   ```sh
   cd research_copilot_webserver
   ```
3. Ensure you have Python **3.10.11** installed.
4. Install the required dependencies:  
   ```sh
   pip install -r requirements.txt
   ```

### **Creating the .env File**  
1. In the **research_copilot_webserver** directory, create a `.env` file to store sensitive information like your Google API key.  
2. Add the following line to the `.env` file (replace with your actual API key):
   ```
   GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY_HERE
   ```
   *Note: Replace `YOUR_GOOGLE_API_KEY_HERE` with your actual Google API key. This is just a dummy placeholder for now.*

3. Save the `.env` file. This file will be used to securely load the Google API key at runtime.

### **Running the Web Server**  
1. Ensure all prerequisites for the web server are met.  
2. Open a terminal or command prompt.  
3. Navigate to the **research_copilot_webserver** directory:  
   ```sh
   cd research_copilot_webserver
   ```  
4. Start the web server:  
   ```sh
   python main.py
   ```

---

## **2️⃣ Installing and Running the Research Copilot Web Client**  

### **Installation Steps**  
1. Open a terminal or command prompt.  
2. Navigate to the **research_copilot_webclient** directory:  
   ```sh
   cd research_copilot_webclient
   ```  
3. Install the required dependencies:  
   ```sh
   npm install
   ```

### **Running the Web Client**  
1. Ensure all prerequisites for the web client are met.  
2. Open a terminal or command prompt.  
3. Navigate to the **research_copilot_webclient** directory:  
   ```sh
   cd research_copilot_webclient
   ```  
4. Start the web client:  
   ```sh
   npm start
   ```

---

## **🚀 Notes & Recommendations**  
- The **web server** must be running **before** starting the web client.  
- Ensure that all **dependencies** are installed correctly to avoid errors.  
- Use a **virtual environment** for the Python server to manage dependencies efficiently.  
- The required **Python version is 3.10.11**. Ensure this version is installed before proceeding.
- For an optimized UI experience, we recommend zooming out to 80% in your browser to ensure the best layout and visibility.