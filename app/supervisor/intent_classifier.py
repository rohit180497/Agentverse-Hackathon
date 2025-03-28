from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from jinja2 import Template
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Gemini
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", google_api_key=os.getenv("GEMINI_API_KEY"))
output_parser = StrOutputParser()

parser = StrOutputParser()

def load_prompt_template(path):
    with open(path, "r", encoding="utf-8") as file:
        return Template(file.read())
    
jinja_template = load_prompt_template("prompts/intent_prompt.txt")


def is_travel_query(message: str, chat_history) -> bool:
    try:
        formatted_history = chat_history[-5:]  # only last 5 messages for brevity
        intent_prompt = jinja_template.render(user_message=message, chat_history=formatted_history)
        response = parser.invoke(llm.invoke(intent_prompt)).strip()
        # response = intent_chain.invoke({"query": message}).strip().upper()
        # print("[Intent Classification Response True]", response)
        return response.strip().lower() == "true"
    except Exception as e:
        # print("[Fallback Response False]", response)
        return response.strip().lower() == "false"
