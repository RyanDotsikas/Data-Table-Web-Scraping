# Data-Table-Web-Scraping
Hubdoc Robot Dev Code Test

Contained in this repository is the WebScraper.js file which will utilize the Headless Chrome Library: Puppeteer, to complete the following task:
  1. Navigates to Google.com
  2. Searches for 'datatables'
  3. Finds and selects the https://datatables.net website
  4. Extracts all of the data in the table as an array of objects
  5. Exports the data as a .CSV file for easy viewing

How To Run:
  1. Ensure you have Node.JS installed on your computer (can be installed here: https://nodejs.org/en/download/)
  2. Install Puppeteer with the following command line: npm install --save puppeteer
  3. Install the Objects-To-CSV package with the following command line: npm i objects-to-csv
  4. Navigate to this repository and type: node WebScraper.js
  5. (Note: if you wish to watch the process occur, open the file and on line 7 change the 'true' to 'false')
