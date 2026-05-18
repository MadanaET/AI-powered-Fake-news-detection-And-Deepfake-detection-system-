import urllib.request

print("Downloading a totally different video (Bear)...")
url = "https://www.w3schools.com/tags/movie.mp4"
output_path = "sample_different_deepfake.mp4"

try:
    urllib.request.urlretrieve(url, output_path)
    print(f"Successfully downloaded {output_path}!")
except Exception as e:
    print(f"Error downloading: {e}")
