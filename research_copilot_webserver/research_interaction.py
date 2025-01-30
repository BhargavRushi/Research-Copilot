import google.generativeai as genai
import os
import httpx
import base64
import io
from dotenv import load_dotenv

def multiple_pdfs():
    load_dotenv()
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    model = genai.GenerativeModel("gemini-1.5-flash")
    list = []

    doc_url_1 = "https://arxiv.org/pdf/2312.11805" # Replace with the URL to your first PDF
    doc_url_2 = "https://arxiv.org/pdf/2403.05530" # Replace with the URL to your second PDF
    print("Retrieve started")
    # Retrieve and upload both PDFs using the File API
    doc_data_1 = io.BytesIO(httpx.get(doc_url_1).content)
    doc_data_2 = io.BytesIO(httpx.get(doc_url_2).content)
    print("Retrieve end")

    sample_pdf_1 = genai.upload_file(path=doc_data_1, mime_type='application/pdf')
    sample_pdf_2 = genai.upload_file(path=doc_data_2, mime_type='application/pdf')
    print("Upload end")

    prompt = "What is the difference between each of the main benchmarks between these two papers?"
    #prompt = "1. Summarize each of these papers in a maxiumum of 3 sentences. Come up with similarities of these papers. Come up with unique insights by corelating these papers if they are related."
    list.append(sample_pdf_1)
    list.append(sample_pdf_2)
    list.append(prompt)
    print("Generate start")
    response = model.generate_content([sample_pdf_1, sample_pdf_2, prompt])
    print("Generate end")
    print(response.text)
    sample_pdf_1.delete()
    sample_pdf_2.delete()



def generate_content(doc_url_list):
    load_dotenv()
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    model = genai.GenerativeModel("gemini-1.5-flash")
    doc_data = ""
    my_list = []
    for url in doc_url_list:
        if not url.startswith("http://") and not url.startswith("https://"):
            with open(url, "rb") as doc_file:
                doc_data = base64.standard_b64encode(doc_file.read()).decode("utf-8")
        else:
            doc_data = io.BytesIO(httpx.get(url).content)
        
        sample = genai.upload_file(path = doc_data,mime_type="application/pdf")
        my_list.append(sample)


    prompt = "You are an expert scientific researcher who has years of experience in conducting systematic literature surveys and meta-analyses of different topics. You pride yourself on incredible accuracy and attention to detail. You always stick to the facts in the sources provided, and never make up new facts. \n\n Analyse the given research papers and 1. Summarize each of them in a maxiumum of 3 sentences. Come up with similarities of the papers. Come up with unique insights by corelating the papers if they are related. "

    # papers_list = []
    # for f in genai.list_files:
    #     papers_list.append(f)
    # papers_list.append(prompt)
    my_list.append(prompt)

    response = model.generate_content(my_list)
    print(response.text)