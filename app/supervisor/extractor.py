from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import StrOutputParser
from jinja2 import Template
import json, os
import re
from dotenv import load_dotenv

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    google_api_key=os.getenv("GEMINI_API_KEY"),
    convert_system_message_to_human=True
)

parser = StrOutputParser()

def load_prompt_template(path):
    with open(path, "r", encoding="utf-8") as file:
        return Template(file.read())
    
jinja_template = load_prompt_template("prompts/extractor_prompt.txt")


def extract_trip_details(user_message: str) -> dict:
    try:
        rendered_prompt = jinja_template.render(user_message=user_message)
        # print("[endered Prompt]", rendered_prompt)

        response = parser.invoke(llm.invoke(rendered_prompt)).strip()

        # Remove markdown code block wrappers if present
        if response.startswith("```"):
            response = re.sub(r"```(json)?", "", response).strip()
            response = response.replace("```", "").strip()

        print("[🔍 Gemini Raw Output]", response)

        parsed = json.loads(response)
        return parsed

    except Exception as e:
        print("[⚠️ Extractor Error]", str(e))
        return {
            "error": "Failed to parse response",
            "details": str(e),
            "fallback_message": "I'm your travel planner. Could you tell me your source, destination, and travel dates?"
        }