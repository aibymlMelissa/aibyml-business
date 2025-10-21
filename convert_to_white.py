from PIL import Image

def convert_to_white(input_path, output_path):
    """
    Convert all non-transparent pixels in the logo to white
    """
    # Open the image
    img = Image.open(input_path)

    # Convert to RGBA if not already
    img = img.convert("RGBA")

    # Get pixel data
    pixdata = img.load()

    # Get image dimensions
    width, height = img.size

    # Convert all non-transparent pixels to white
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixdata[x, y]

            # If pixel is not fully transparent, make it white
            if a > 0:
                pixdata[x, y] = (255, 255, 255, a)  # White with original alpha

    # Save the result
    img.save(output_path, "PNG")
    print(f"Successfully converted logo to white!")
    print(f"Saved to: {output_path}")

if __name__ == "__main__":
    input_file = "/Users/aibyml.com.hk/AIServicePlatform/frontend/public/AIbyML_Logo.png"
    output_file = "/Users/aibyml.com.hk/AIServicePlatform/frontend/public/AIbyML_Logo.png"

    print(f"Processing: {input_file}")
    convert_to_white(input_file, output_file)
