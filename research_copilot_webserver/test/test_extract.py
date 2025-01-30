import pytest
from unittest import mock
from extract import fetch_papers, extract_pdf_from_url, download_pdf, create_pdf_from_urls
import requests
import io
import pypdf
import pytest_cov

expected_text_sample = "The Many Faces of Robustness"

def test_fetch_papers_valid_response():
    # Mock the response from the Semantic Scholar API
    mock_data = {"data": [{"title": "Test Paper", "year": 2022}]}
    with mock.patch('requests.get', return_value=mock.Mock(status_code=200, json=lambda: mock_data)):
        papers = fetch_papers("test", 2020, 2022, 5)
        assert len(papers) == 1
        assert papers[0]['title'] == "Test Paper"

def test_fetch_papers_invalid_response():
    mock_response = mock.Mock()
    mock_response.status_code = 500
    mock_response.raise_for_status.side_effect = requests.exceptions.HTTPError("Internal Server Error")

    with mock.patch('requests.get', return_value=mock_response):
        with pytest.raises(requests.exceptions.HTTPError):
            fetch_papers("test", 2020, 2022, 5)

def test_extract_pdf_from_url_valid():
    # Mock the requests.get to simulate downloading a valid PDF
   mock_pdf_content = b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"  # Simplified PDF content
   with mock.patch('requests.get', return_value=mock.Mock(content=mock_pdf_content)):
        # Mock PdfReader to simulate extracting the text from the PDF
        with mock.patch('pypdf.PdfReader') as mock_pdf_reader:
            mock_page = mock.Mock()
            mock_page.extract_text.return_value = "The Many Faces of Robustness in Machine Learning"
            mock_pdf_reader.return_value.pages = [mock_page]
            
            # Call the function with the mock PDF URL
            text = extract_pdf_from_url("https://arxiv.org/pdf/2006.16241.pdf")
            
            # Check if the expected text is in the extracted text
            assert expected_text_sample in text
def test_extract_pdf_from_url_no_text():
    # Simulate a PDF that has no text to extract
    mock_pdf = io.BytesIO(b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n")
    with mock.patch('requests.get', return_value=mock.Mock(content=mock_pdf.read)):
        with mock.patch('pypdf.PdfReader') as mock_pdf_reader:
            mock_pdf_reader.return_value.pages = [mock.Mock(extract_text=lambda: "")]
            text = extract_pdf_from_url("https://arxiv.org/pdf/2006.16241.pdf")
            assert text == ""

def test_download_pdf_valid_url():
    # Mock the requests.get to return a valid PDF content
    mock_pdf = io.BytesIO(b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n")
    with mock.patch('requests.get', return_value=mock.Mock(status_code=200, content=mock_pdf.getvalue())):
        pdf_file = download_pdf("https://arxiv.org/pdf/2006.16241.pdf")
        # Assert that the result is a BytesIO object
        assert isinstance(pdf_file, io.BytesIO)


def test_download_pdf_invalid_url():
    # Simulate a failed PDF download
    with mock.patch('requests.get', return_value=mock.Mock(status_code=404)):
        pdf_file = download_pdf("https://arxi.org/pdf/2006.16241.pdf")
        assert pdf_file is None

def test_create_pdf_from_urls_valid():
    # Mock the download_pdf and PdfWriter to simulate the merging of PDFs
    mock_pdf = io.BytesIO(b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n")
    with mock.patch('extract.download_pdf', return_value=mock_pdf), mock.patch('pypdf.PdfWriter') as mock_pdf_writer:
        mock_pdf_writer.return_value.write = mock.Mock()
        output_pdf = create_pdf_from_urls(["https://arxiv.org/pdf/2006.16241.pdf", "https://arxiv.org/pdf/2006.16242.pdf"])
        assert output_pdf == 'outputs/corpus.pdf'
        mock_pdf_writer.return_value.write.assert_called_once()

def test_create_pdf_from_urls_invalid_url():
    # Simulate a failure to download a PDF
    with mock.patch('extract.download_pdf', return_value=None):
        output_pdf = create_pdf_from_urls(["https://arxiv.org/pdf/2006.1624.pdf"])
        assert output_pdf == 'outputs/corpus.pdf'  # No PDFs added, but the file should still be created
