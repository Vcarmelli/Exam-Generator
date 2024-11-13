import os
import re
from PIL import Image
from pdf2image import convert_from_path
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import PromptTemplate

def convert_file_to_thumbnail(file_path, thumbnail_path, start_page=0, end_page=1, size=(256, 256)):
    # Convert PDF to a list of images (one per page)
    images = convert_from_path(file_path, dpi=180)

    # in case the pages are less than 10 (first set of pages to load)
    end_page = min(end_page, len(images)) 
    if end_page < start_page:
        print("No pages to convert.")
        return []
    # pages should be zero based
    # last page excluded 

    for count, page in enumerate(images[start_page:end_page], start=start_page):
        print(f"creating thumbnail of page: {count + 1}")
        page.thumbnail(size)
        thumbnail_file = os.path.join(thumbnail_path, f'thumbnail_{count}.jpg')
        page.save(thumbnail_file, 'JPEG')

    # Return the list of generated thumbnails
    return [f'thumbnail_{i}.jpg' for i in range(start_page, end_page)]



def parse_page_ranges(pages):
    page_list = []
    for part in pages.split(','):
        part = part.strip() 
        if '-' in part:
            # Handle range, e.g., "2-6"
            start, end = map(int, part.split('-'))
            page_list.extend(range(start, end + 1))  # Add each page in the range
        else:
            # Handle single page, e.g., "5"
            page_list.append(int(part))
    
    return page_list



def extract_text(file_path, pages):
    loader = PyMuPDFLoader(file_path)
    docs = loader.load()   

    extracted_text = ""
    for page_num in pages:
        if page_num <= len(docs):
            extracted_text += docs[page_num-1].page_content

    #print(extracted_text)
    return extracted_text


def abbreviate(q_type):
    return {'identification': 'IDN', 'multiple_choice': 'MCQ', 'true_or_false': 'TOF'}.get(q_type.lower(), 'UNKNOWN')

def get_prompt(question_type):
    # Prompts for each type of question
    question_prompts = {
        'MCQ': """
            Generate {number_of_questions} multiple-choice questions from the following text. 
            For each question, provide four options (a, b, c, d) and specify the correct answer 
            at the end in the following format:

                1. Question text here?
                a) Option A
                b) Option B
                c) Option C
                d) Option D

                Answer: [correct answer letter]

                The questions should be clear, concise, and relevant to the text. Here is the text:
                {context}
            """,

        'TOF': """
            Generate {number_of_questions} True or False questions from the following text. 
            For each question, specify the correct answer at the end in the following format:

                1. Question text here?
                a) True
                b) False

                Answer: [correct answer letter]

                The questions should be clear, concise, and relevant to the text. Here is the text:
                {context}
            """,

        'IDN': """
            Generate {number_of_questions} Identification Questions from the following text. 
            For each question, specify the correct answer at the end in the following format:

                1. Question text here?

                Answer: [correct answer]

                The questions should be clear, concise, and relevant to the text. Here is the text:
                {context}
            """
    }

    return question_prompts.get(question_type, '')


# def generate_questions(questions, text):
#     llm = OllamaLLM(model="llama3")
#     all_generated_questions = []

#     # Loop through each selected question type and corresponding number of questions
#     for question in questions:
#         question_type = question.get('type')
#         question_type = abbreviate(question_type)

#         num_questions = question.get('quantity')
#         print(f"Generating {num_questions} {question_type} questions...")

#         # Get the corresponding prompt for the current question type
#         question_prompt = get_prompt(question_type)
#         if question_prompt:
#             prompt_template = PromptTemplate.from_template(template=question_prompt)   
#             # Format the prompt with the number of questions
#             prompt = prompt_template.format(
#                                         number_of_questions=num_questions,
#                                         context=text                                       
#                                         )

#             # Invoke the LLM (LangChain model) to generate questions
#             result = llm.invoke(prompt)

#             # Append the result to the list
#             all_generated_questions.append({
#                 'type': question_type,
#                 'questions': result
#             })
    
#     return all_generated_questions

# SAMPLE GENERATED QUESTIONS
def generate_questions(questions, text):
    return [
        {
            "questions": "Here are two identification questions based on the provided text:\n\n1. What style of visual art is often considered defining in Canadian visual art?\n\nAnswer: Landscape\n\n2. Who is a Brazilian architect known for his innovative use of abstract forms and curves, and designed iconic structures such as the National Congress of Brazil and the United Nations headquarters in New York?\n\nAnswer: Oscar Niemeyer",
            "type": "IDN"
        },
        {
            "questions": "Here is one multiple-choice question based on the provided text:\n\n1. What is Nigeria known for in terms of traditional art forms?\na) Ancient pottery only\nb) Vibrant traditional art forms including Nok terracotta sculptures, Yoruba masks, and contemporary art scenes\nc) Modern paintings only\nd) Woodcarvings only\n\nAnswer: b",
            "type": "MCQ"
        },
        {
            "questions": "Here are two true or false questions based on the text:\n\n1. The Group of Seven was a group of artists who produced pseudo-impressionist works in the 19th century.\n\na) True\nb) False\n\nAnswer: b) False (According to the text, they produced their works in the 1920s and 1930s.)\n\n2. Oscar Niemeyer designed the United Nations headquarters in New York alone.\n\na) True\nb) False\n\nAnswer: b) False (According to the text, Oscar Niemeyer co-designed the United Nations headquarters in New York.)",
            "type": "TOF"
        }
    ]

def parse_result(generated_questions):
    result_data = []

    for result in generated_questions:
        q_type = result["type"]
        q_text = result["questions"]
        questions_list = []

        print(f"Type: {q_type}")
        
        
        if q_type == "MCQ" or q_type == "TOF":
            # Regular expression to extract questions and answers 
            matches = re.findall(r'\d+\.\s(.*?)\n(a\).*?)\n\nAnswer:\s(.*?)(?=\n\n\d+\.|$)', q_text, re.DOTALL) # returns list of tuple (question, choices, answer) good for MCQ and TOF formats

            # Iterate through all matches
            for idx, match in enumerate(matches):
                question = match[0].strip()  # Extract question
                choices = match[1].strip()   # Extract choices
                answer = match[2].strip()    # Extract answer

                # Extract choices as a list
                choice_texts = re.findall(r'[a-d]\)\s(.*)', choices)
                questions_list.append({
                    "question": question,
                    "choices": [choice.strip() for choice in choice_texts],
                    "answer": answer
                })

        elif q_type == "IDN":
            # Regex for Identification questions
            matches = re.findall(r'\d+\.\s(.*?)\n\nAnswer:\s(.*?)(?=\n\n\d+\.|$)', q_text, re.DOTALL) # returns list of tuple (question, answer) good for IDN formats

            # Iterate through all matches
            for idx, match in enumerate(matches):
                question = match[0].strip()  # Extract question
                answer = match[1].strip()    # Extract answer
                
                questions_list.append({
                    "question": question,
                    "answer": answer
                })

        # Append processed questions of the current type to result data
        result_data.append({
            "type": q_type,
            "questions": questions_list
        })

    return result_data


