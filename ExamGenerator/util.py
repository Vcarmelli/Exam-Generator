import os
from PIL import Image
from pdf2image import convert_from_path
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_ollama.llms import OllamaLLM

def convert_file_to_thumbnail(file_path, thumbnail_path, start_page=0, end_page=1, size=(256, 256)):
    images = convert_from_path(file_path, dpi=180)

    end_page = min(end_page, len(images))
    if end_page < start_page:
        print("No pages to convert.")
        return []

    for count, page in enumerate(images[start_page:end_page], start=start_page):
        print(f"Creating thumbnail of page: {count + 1}")
        page.thumbnail(size)
        thumbnail_file = os.path.join(thumbnail_path, f'thumbnail_{count}.jpg')
        page.save(thumbnail_file, 'JPEG')

    return [f'thumbnail_{i}.jpg' for i in range(start_page, end_page)]

def parse_page_ranges(pages):
    page_list = []
    for part in pages.split(','):
        part = part.strip()
        if '-' in part:
            start, end = map(int, part.split('-'))
            page_list.extend(range(start, end + 1))
        else:
            page_list.append(int(part))
    
    return page_list

def extract_text(file_path, pages):
    loader = PyMuPDFLoader(file_path)
    docs = loader.load()

    extracted_text = ""
    for page_num in pages:
        if page_num <= len(docs):
            extracted_text += docs[page_num-1].page_content

    return extracted_text

def generate_questions(questions, text):
    llm = OllamaLLM(model="llama3")
    all_generated_questions = []

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
            """,

        'TOF': """
            Generate {number_of_questions} True or False questions from the following text. 
            For each question, specify the correct answer at the end in the following format:

                1. Question text here?
                a) True
                b) False

                Answer: [correct answer letter]

                The questions should be clear, concise, and relevant to the text. Here is the text:
            """,

        'IDN': """
            Generate {number_of_questions} Identification Questions from the following text. 
            For each question, specify the correct answer at the end in the following format:

                1. Question text here?

                Answer: [correct answer]

                The questions should be clear, concise, and relevant to the text. Here is the text:
            """
    }

    for question in questions:
        question_type = abbreviate(question.get('type'))
        num_questions = question.get('quantity')
        print(f"Generating {num_questions} {question_type} questions...")

        prompt_template = question_prompts.get(question_type)
        if prompt_template:
            prompt = prompt_template.format(number_of_questions=num_questions)
            formatted_prompt = prompt + text
            result = llm.invoke(formatted_prompt)

            # Improved parsing to handle questions and answers without strict "Answer:" keyword
            question_answer_pairs = []
            lines = result.strip().split('\n')
            current_question = ""
            current_answer = ""
            for line in lines:
                line = line.strip()
                if line.startswith(tuple(str(i) for i in range(1, num_questions + 1))):
                    # Start of a new question
                    if current_question:
                        question_answer_pairs.append({
                            'text': current_question.strip(),
                            'answer': current_answer.strip()
                        })
                    current_question = line  # New question text
                    current_answer = ""
                elif line.lower().startswith("answer:"):
                    # Line contains the answer
                    current_answer = line.split(":", 1)[1].strip()
                elif current_question:
                    # Additional lines for the current question
                    current_question += " " + line

            # Add the last question-answer pair if it exists
            if current_question:
                question_answer_pairs.append({
                    'text': current_question.strip(),
                    'answer': current_answer.strip()
                })

            all_generated_questions.append({
                'type': question_type,
                'questions': question_answer_pairs
            })

    return all_generated_questions

def abbreviate(q_type):
    return {'identification': 'IDN', 'multiple_choice': 'MCQ', 'true_or_false': 'TOF'}.get(q_type.lower(), 'UNKNOWN')
