from fastapi import FastAPI, File, Form, UploadFile
from pydantic import BaseModel
from typing import List, Tuple
import uvicorn
from extract import fetch_papers, create_pdf_from_urls
from fastapi.middleware.cors import CORSMiddleware
from crew import PdfRag

# python -m venv venv
# cd venv/Scripts && activate && cd ../../

app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.get('/get_resources')
def get_resources(topic: str, min_year : int, max_year : int,max_papers: int):
    papers = fetch_papers(topic, min_year, max_year, max_papers)
    papers_with_pdf = [paper for paper in papers if paper.get('openAccessPdf') is not None and (paper.get('openAccessPdf')['status'] == 'CLOSED' or paper.get('openAccessPdf')['status'] == 'HYBRID' or paper.get('openAccessPdf')['status'] == 'GREEN')]
    return papers_with_pdf

class TuplesList(BaseModel):
    url_name_list: List[Tuple[str, str]]

@app.get('/chat')
def chat_with_pdf(query: str):
    inputs = {
        'input': query,
    }
    result = PdfRag().crew().kickoff(inputs=inputs)
    return result

# @app.post('/Summarize_pdfs')
# def summarize_pdfs(data: List[str]):
#     create_pdf_from_urls(data)
#     inputs = {
#         'input': 'Summarize each of the abstract sections of the pdf in 5 to 10 sentences?',
#     }
#     result = PdfRag().crew().kickoff(inputs=inputs)
#     print(result)
#     return result

@app.post('/Summarize_pdfs')
def summarize_pdfs(files: List[UploadFile] = File(...), web_urls: str = Form(...)):
    urls = web_urls.split(",") if web_urls else []
    create_pdf_from_urls(urls, files)
    inputs = {
        'input': 'Summarize each of the abstract sections of the pdf in 5 to 10 sentences?',
    }
    result = PdfRag().crew().kickoff(inputs=inputs)
    return result

if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=8000, reload=True)