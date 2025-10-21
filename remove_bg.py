from PIL import Image
import sys

def remove_white_background_smooth(input_path, output_path, threshold=250):
    """
    Remove white background from PNG image with smooth edges
    """
    # Open the image
    img = Image.open(input_path)

    # Convert to RGBA if not already
    img = img.convert("RGBA")

    # Get pixel data
    pixdata = img.load()

    # Get image dimensions
    width, height = img.size

    # Replace white/near-white pixels with transparent
    # Use a gradient for semi-transparent edges
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixdata[x, y]

            # Calculate how "white" the pixel is
            avg = (r + g + b) / 3

            if avg > threshold:
                # Pure white - make fully transparent
                pixdata[x, y] = (r, g, b, 0)
            elif avg > threshold - 30:
                # Near white - make partially transparent for smooth edges
                alpha = int((threshold - avg) / 30 * 255)
                pixdata[x, y] = (r, g, b, alpha)

    # Save the result
    img.save(output_path, "PNG")
    print(f"Successfully removed white background with smooth edges!")
    print(f"Saved to: {output_path}")

if __name__ == "__main__":
    input_file = "/Users/aibyml.com.hk/AIServicePlatform/frontend/public/AIbyML_Logo_original.png"
    output_file = "/Users/aibyml.com.hk/AIServicePlatform/frontend/public/AIbyML_Logo.png"

    print(f"Processing: {input_file}")
    remove_white_background_smooth(input_file, output_file, threshold=250)
