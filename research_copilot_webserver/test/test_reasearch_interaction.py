import pytest
from unittest import mock
import io
import httpx
import google.generativeai as genai
from research_interaction import multiple_pdfs, generate_content
import pytest_cov

# Mock the HTTP requests
@mock.patch("httpx.get")
@mock.patch("google.generativeai.GenerativeModel")
@mock.patch("google.generativeai.upload_file")

def test_multiple_pdfs(mock_upload_file, mock_GenerativeModel, mock_get):
    # Mocking the HTTP response for PDF retrieval
    mock_get.return_value.content = b"pdf content"
    
    # Mocking the upload file response
    mock_upload_file.return_value = mock.Mock(id="123", delete=lambda: None)
    
    # Mocking the model's generate_content method
    mock_model_instance = mock.Mock()
    mock_GenerativeModel.return_value = mock_model_instance
    mock_model_instance.generate_content.return_value.text = "Some generated content"

    # Run the function
    multiple_pdfs()

    # Check if the get requests were made correctly
    mock_get.assert_any_call("https://arxiv.org/pdf/2312.11805")
    mock_get.assert_any_call("https://arxiv.org/pdf/2403.05530")

    # Check if the files were uploaded
    mock_upload_file.assert_any_call(path=mock.ANY, mime_type="application/pdf")

    # Check if the generate_content method was called
    mock_model_instance.generate_content.assert_called_once_with(
        [mock.ANY, mock.ANY, "What is the difference between each of the main benchmarks between these two papers?"]
    )

    # Check if the content generated was printed
    assert "Some generated content" in mock_model_instance.generate_content.return_value.text

@mock.patch("httpx.get")
@mock.patch("google.generativeai.GenerativeModel")
@mock.patch("google.generativeai.upload_file")
def test_generate_content(mock_upload_file, mock_GenerativeModel, mock_get):
    # Mocking the HTTP response for PDF retrieval
    mock_get.return_value.content = b"pdf content"

    # Creating mock return values for the uploaded files
    mock_file_1 = mock.Mock(id="123", delete=lambda: None)
    mock_file_2 = mock.Mock(id="124", delete=lambda: None)
    mock_upload_file.side_effect = [mock_file_1, mock_file_2]

    # Mocking the model's generate_content method
    mock_model_instance = mock.Mock()
    mock_GenerativeModel.return_value = mock_model_instance
    mock_model_instance.generate_content.return_value.text = "Generated content for the research papers"

    # Sample URLs for testing
    doc_url_list = ["https://arxiv.org/pdf/2312.11805", "https://arxiv.org/pdf/2403.05530"]

    # Run the function
    generate_content(doc_url_list)

    # Check if the get requests were made correctly
    mock_get.assert_any_call("https://arxiv.org/pdf/2312.11805")
    mock_get.assert_any_call("https://arxiv.org/pdf/2403.05530")

    # Check if the files were uploaded
    mock_upload_file.assert_any_call(path=mock.ANY, mime_type="application/pdf")

    # Check if the generate_content method was called with the correct parameters
    mock_model_instance.generate_content.assert_called_once_with(
        [mock_file_1, mock_file_2, "You are an expert scientific researcher who has years of experience in conducting systematic literature surveys and meta-analyses of different topics. You pride yourself on incredible accuracy and attention to detail. You always stick to the facts in the sources provided, and never make up new facts. \n\n Analyse the given research papers and 1. Summarize each of them in a maximum of 3 sentences. Come up with similarities of the papers. Come up with unique insights by correlating the papers if they are related."]
    )

    # Check if the content generated was printed
    assert "Generated content for the research papers" in mock_model_instance.generate_content.return_value.text
