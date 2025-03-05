import requests
from bs4 import BeautifulSoup

# List of URLs to scrape
URLS = [
    "https://developers.facebook.com/blog/post/2022/10/24/sending-messages-with-whatsapp-in-your-python-applications/",
    
  ]

# Output file
OUTPUT_FILE = "scraped_content.txt"

def clean_body_content(html_content):
    """Extracts and cleans the <body> content from an HTML page."""
    soup = BeautifulSoup(html_content, "html.parser")
    
    # Extract <body> content only
    body = soup.body
    
    if body:
        # Remove script and style tags
        for tag in body(["script", "style"]):
            tag.decompose()
        
        # Get text and clean whitespace
        body_text = body.get_text(separator=" ", strip=True)
        return body_text
    return ""

def scrape_and_save(urls, output_file):
    """Scrapes each URL, extracts the body, and saves it to a file."""
    with open(output_file, "w", encoding="utf-8") as file:
        for url in urls:
            print(f"Scraping: {url}")
            try:
                response = requests.get(url, timeout=10)
                response.raise_for_status()
                
                body_text = clean_body_content(response.text)
                
                if body_text:
                    file.write(body_text + "\n--------------\n")
                else:
                    print(f"Warning: No body content found for {url}")
            
            except requests.RequestException as e:
                print(f"Failed to scrape {url}: {e}")

    print(f"Scraping completed! Content saved to {output_file}")

# Run the scraper
scrape_and_save(URLS, OUTPUT_FILE)
