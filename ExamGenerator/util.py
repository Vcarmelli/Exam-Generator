import os
from PIL import Image
from pdf2image import convert_from_path
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_ollama.llms import OllamaLLM

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

# tn_path = r'D:\VASHTI\OneDrive - Technological University of the Philippines\.THESIS_Exam-Generator\ExamGenerator\static\uploads\trials'
# file_path = r'D:\VASHTI\OneDrive - Technological University of the Philippines\.THESIS_Exam-Generator\ExamGenerator\static\uploads\CAMU - Arts Culture.pdf'
# thumbnails = convert_file_to_thumbnail(file_path, tn_path)
# print(thumbnails)


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

#print(parse_page_ranges('2-9, 10, 15-16'))


def extract_text(file_path, pages):
    loader = PyMuPDFLoader(file_path)
    docs = loader.load()   

    extracted_text = ""
    for page_num in pages:
        if page_num <= len(docs):
            extracted_text += docs[page_num-1].page_content

    #print(extracted_text)
    return extracted_text

def generate_questions(questions, text):
    llm = OllamaLLM(model="llama3")
    all_generated_questions = []
    
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

    # Loop through each selected question type and corresponding number of questions
    for question in questions:
        question_type = question.get('type')
        question_type = abbreviate(question_type)

        num_questions = question.get('quantity')
        print(f"Generating {num_questions} {question_type} questions...")

        # Get the corresponding prompt for the current question type
        prompt_template = question_prompts.get(question_type)
        if prompt_template:
            # Format the prompt with the number of questions
            prompt = prompt_template.format(number_of_questions=num_questions)

            # Combine the text with the prompt
            formatted_prompt = text + prompt

            # Invoke the LLM (LangChain model) to generate questions
            result = llm.invoke(formatted_prompt)

            # Append the result to the list
            all_generated_questions.append({
                'type': question_type,
                'questions': result
            })

    return all_generated_questions

def abbreviate(q_type):
    return {'identification': 'IDN', 'multiple_choice': 'MCQ', 'true_or_false': 'TOF'}.get(q_type.lower(), 'UNKNOWN')



