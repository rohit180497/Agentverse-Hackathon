from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from jinja2 import Template
import os

# Setup Gemini LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",  
    google_api_key=os.getenv("GEMINI_API_KEY")
)
parser = StrOutputParser()

# Load prompt
def load_template(path):
    with open(path, "r", encoding="utf-8") as file:
        return Template(file.read())

itinerary_template = load_template("prompts/itinerary_prompt.txt")

def generate_itinerary_summary(llm_input: str) -> str:
    try:
        prompt_text = itinerary_template.render(llm_input=llm_input)
        response = parser.invoke(llm.invoke(prompt_text))
        return response.strip()
    except Exception as e:
        print("Gemini Itinerary Summary Error:", str(e))
        return "Failed to generate itinerary summary. Please try again later."
