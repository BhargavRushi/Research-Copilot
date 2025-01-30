from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
from crewai_tools import PDFSearchTool
from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()

llm=LLM(model="gemini/gemini-1.5-flash",
                           temperature=0.5,
                           api_key=os.getenv("GOOGLE_API_KEY"))

# Get the directory where the script is located
SCRIPT_DIR = Path(__file__).parent
pdf_path = str(SCRIPT_DIR / "outputs/corpus.pdf")
print(pdf_path)

# Use the resolved path for the PDFSearchTool
pdf_search_tool = PDFSearchTool(
    config=dict(
        llm=dict(
            provider="google", # or google, openai, anthropic, llama2, ...
            config=dict(
                model="models/gemini-1.5-flash",
                temperature=0.3,
				api_key=os.getenv("GOOGLE_API_KEY")
                # top_p=1,
                # stream=true,
            ),
        ),
        embedder=dict(
            provider="google", # or openai, ollama, ...
            config=dict(
                model="models/text-embedding-004",
                task_type="retrieval_document",
                title="Embeddings",
            ),
        ),
    ),
	pdf = pdf_path
)

@CrewBase
class PdfRag():
	"""PdfRag crew"""

	agents_config = 'config/agents.yaml'
	tasks_config = 'config/tasks.yaml'

	@agent
	def pdf_rag_agent(self) -> Agent:
		return Agent(
			config=self.agents_config['pdf_rag_agent'],
			tools=[pdf_search_tool],
			memory=True,
			verbose=True,
			llm=llm
		)

	@agent
	def pdf_summary_agent(self) -> Agent:
		return Agent(
			config=self.agents_config['pdf_summary_agent'],
			memory=True,
			verbose=True,
			llm=llm
		)

	@task
	def pdf_rag_task(self) -> Task:
		return Task(
			config=self.tasks_config['pdf_rag_task'],
		)

	@task
	def pdf_summary_task(self) -> Task:
		return Task(
			config=self.tasks_config['pdf_summary_task'],
		)

	@crew
	def crew(self) -> Crew:
		"""Creates the PdfRag crew"""
		return Crew(
			agents=self.agents, # Automatically created by the @agent decorator
			tasks=self.tasks, # Automatically created by the @task decorator
			process=Process.sequential,
			verbose=True,
			# process=Process.hierarchical, # In case you wanna use that instead https://docs.crewai.com/how-to/Hierarchical/
        )