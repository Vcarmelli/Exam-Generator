import os
from pdf2image import convert_from_path
from PIL import Image
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import PromptTemplate


# Convert PDF pages to thumbnails
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


# Parse page ranges (e.g., "1-5, 8, 10-12")
def parse_page_ranges(pages):
    page_list = []
    for part in pages.split(','):
        part = part.strip()
        if '-' in part:
            try:
                start, end = map(int, part.split('-'))
                page_list.extend(range(start, end + 1))
            except ValueError:
                print(f"Invalid page range: {part}")
        else:
            try:
                page_list.append(int(part))
            except ValueError:
                print(f"Invalid page number: {part}")

    return page_list


# Extract text from the given pages of a PDF
def extract_text(file_path, pages):
    loader = PyMuPDFLoader(file_path)
    docs = loader.load()

    extracted_text = ""
    for page_num in pages:
        if page_num <= len(docs):
            extracted_text += docs[page_num - 1].page_content
        else:
            print(f"Page {page_num} is out of range. Skipping.")

    return extracted_text

def generate_questions(questions, text):
    llm = OllamaLLM(model="llama3")
    all_generated_questions = []

    # Define question prompts for different types of questions
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

    for question in questions:
        question_type = abbreviate(question.get('type'))
        num_questions = question.get('quantity')
        print(f"Generating {num_questions} {question_type} questions...")

        # Retrieve the prompt template and replace placeholders
        prompt_template = question_prompts.get(question_type)
        if prompt_template:
            prompt = prompt_template.format(number_of_questions=num_questions, context=text)
            result = llm.invoke(prompt)

            # Parsing the results based on question type
            question_answer_pairs = []
            lines = result.strip().split('\n')
            current_question = ""
            current_answer = ""
            options = []
            for line in lines:
                line = line.strip()
                if line.startswith(tuple(str(i) for i in range(1, num_questions + 1))):
                    # New question detected
                    if current_question:
                        question_answer_pairs.append({
                            'type': question_type,  # Ensure the type is included here
                            'text': current_question.strip(),
                            'options': options if options else None,
                            'answer': current_answer.strip()
                        })
                    current_question = line  # Start new question
                    current_answer = ""
                    options = []  # Reset options for new question
                elif line.lower().startswith("answer:"):
                    # Capture answer
                    current_answer = line.split(":", 1)[1].strip()
                elif line.startswith(('a)', 'b)', 'c)', 'd)')) and question_type == 'MCQ':
                    # Capture multiple-choice options
                    options.append(line)
                elif current_question:
                    # Additional lines for the current question
                    current_question += " " + line

            # Append the final question-answer pair if it exists
            if current_question:
                question_answer_pairs.append({
                    'type': question_type,  # Add type here
                    'text': current_question.strip(),
                    'options': options if options else None,
                    'answer': current_answer.strip()
                })

            all_generated_questions.extend(question_answer_pairs)

    return all_generated_questions

# Abbreviate question types
def abbreviate(q_type):
    return {'identification': 'IDN', 'multiple_choice': 'MCQ', 'true_or_false': 'TOF'}.get(q_type.lower(), 'UNKNOWN')
