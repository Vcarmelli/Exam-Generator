import os
from PIL import Image
from pdf2image import convert_from_path
from langchain_community.document_loaders import PyMuPDFLoader

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

