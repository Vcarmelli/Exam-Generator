from PIL import Image
from pdf2image import convert_from_path
import os

def convert_file_to_thumbnail(file_path, thumbnail_path, size=(256, 256)):
    # Convert PDF to a list of images (one per page)
    images = convert_from_path(file_path, 200)

    for count, page in enumerate(images):
        # Create a thumbnail for each page
        page.thumbnail(size)

        # Save the thumbnail with a unique name for each page
        thumbnail_file = os.path.join(thumbnail_path, f'thumbnail_{count + 1}.jpg')
        page.save(thumbnail_file, 'JPEG')

    # Return the list of generated thumbnails
    return [f'thumbnail_{i + 1}.jpg' for i in range(len(images))]

