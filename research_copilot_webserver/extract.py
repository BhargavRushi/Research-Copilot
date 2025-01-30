import pypdf
from typing import List
import requests
import io

def fetch_papers(title, start_year, end_year, max_papers):
    if(max_papers > 100):
        max_papers = 100
    url = "https://api.semanticscholar.org/graph/v1/paper/search/"
    params = {
        "query": title,
        "fields": "title,year,venue,openAccessPdf,authors,authors.name,authors.paperCount,referenceCount,influentialCitationCount,fieldsOfStudy",
        "limit": max_papers,
        "offset": 0,
        "yearFilter": f"{start_year}-{end_year}",
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json().get('data', [])
    else:
        response.raise_for_status()

def extract_pdf_from_url(url:str):
    path = url
    text = ""
    try:
        if url.startswith("http://") or url.startswith("https://"):
            response = requests.get(url, stream=True)
            path = io.BytesIO(response.content)
        reader = pypdf.PdfReader(path)
        pages = reader.pages
        text = "".join([page.extract_text() for page in pages])
    except:
        print(f"Error extracting text from PDF at {url}")
    return text


def download_pdf(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            try:
                return io.BytesIO(response.content)
            except:
                return None
    except:
        return None
    else:
        print(f"Failed to download {url}")
        return None
    
def download_pdf_from_file(file):
    try:
        file_content = file.read()

        # 🔹 Process PDF content using PyPDF
        pdf_reader = pypdf.PdfReader(file_content)
    except:
        return None
    
    
def create_pdf_from_urls(urls:List[str], files):
    pdf_merger = pypdf.PdfWriter()
    output_pdf = 'outputs/corpus.pdf'
    for url in urls:
        pdf_file = None
        if url.startswith("http://") or url.startswith("https://"):
            pdf_file = download_pdf(url)
        if pdf_file:
            try:
                pdf_merger.append(pdf_file)
            except:
                print("invalid pdf file")
    for file in files:
        pdf_file = download_pdf_from_file(file)
        if pdf_file:
            try:
                pdf_merger.append(pdf_file)
            except:
                print("invalid pdf file")
    
    with open(output_pdf, 'wb') as output_file:
        pdf_merger.write(output_file)
    
    return output_pdf