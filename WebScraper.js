//Require in the Puppeteer package as well as a package to allow CSV exporting
const puppeteer = require('puppeteer');
const ObjectsToCsv = require('objects-to-csv');

async function scrape() {
	//Launch an instance of Chrome using puppeteer and create a new page
	const browser = await puppeteer.launch({headless: true}); //Change to false to view the window
	const page = await browser.newPage();

	//Navigate to Google's home page
	await page.goto('https://google.com');

	//Type 'datatables' in the search box
	await page.type('input.gLFyf.gsfi', 'datatables');

	//Click on the search button
	await page.evaluate(() => {
		document.querySelector('input[value="Google Search"]').click();
	});
	
	//Use Puppeteer's native method to wait until the page finishes loading
	await page.waitForNavigation();

	//Grab all of the URL's and put their text into an array
	const urlTextArray = await page.evaluate(() => {
		return Array.from(document.querySelectorAll('a cite').values()).map(element => element.innerHTML);
	});

	//Loop through the URLs and find the index of the desired website
	let desiredIndex = -1;
	let desiredURL = 'https://datatables.net';

	for (i = 0; i < urlTextArray.length; i++) {
		if(urlTextArray[i] === desiredURL) {
			desiredIndex = i;
			break;
		}
	}
	if (desiredIndex === -1) {
		throw new Error("The website was not found in the search results");
		browser.close();
		return null;
	}

	//Grab all of the URL links and click on the desired one, then wait until the page loads
	const linkArray = await page.$$('div.r');
	await linkArray[desiredIndex].click();
	await page.waitForNavigation();

	
	let morePages = true;
	const results = [];

	//Continue to grab all info from the data table as long as there are more pages
	while (morePages) {
		const newResults = await page.evaluate(() => {
	  		//Grab all of the table row (tr) elements
	  		const rowArray = Array.from(document.querySelectorAll('#example tr'));

	  		//Remove the first row (since it is simply headers), grab all of the table data (td) and store the text
	  		return rowArray.slice(1).map(tr => {
	    		const dataArray = Array.from(tr.querySelectorAll('td'));
	    		const [ name, position, office, age, startDate ] = dataArray.map(td => td.textContent);

			    return {
			      name,
			      position,
			      office,
			      age,
			      startDate
			    };
			})
		});

		results.push(newResults);

		//Check if there are more pages of data, and if so click on the 'Next' button
		try {
		  await page.click('#example_next:not(.disabled)');
		} catch (error) {
		  morePages = false;
		}
	}

	//Flatten the multi-dimensional array and remove any empty objects
	let mergedResults = [].concat.apply([], results).filter(value => Object.keys(value).length !== 0);

	//Close the browser session and return the data
	await browser.close();
	return mergedResults;
};

//Function that uses a package to export the data in CSV format
async function convertToCSV(data) {
	const csv = new ObjectsToCsv(data);
	await csv.toDisk('./DataTable.csv');
}

scrape().then((value) => convertToCSV(value)).catch(error => console.log(error));