const puppeteer = require('puppeteer');
const fs = require('fs');


// Scrape data from URL
async function scrapeData() {
    const numberPages = 2;


    // Make a loop for each page
    for (let i = 1; i <= numberPages; i++) {
        const browser = await puppeteer.launch(
            {
                headless: false,
                args: [
                    '--window-size=1920,1080',

                ]
            }
        );
        const page = await browser.newPage();
        await page.goto("https://www.paginasamarillas.es/search/floristerias/all-ma/all-pr/all-is/all-ci/all-ba/all-pu/all-nc/" + i + "?what=floristerias"), {
            waitUntil: ['networkidle2', 'domcontentloaded']
        };

        // Click on the button to accept cookies
        await page.click('#onetrust-accept-btn-handler');

        // Scroll to the bottom of the page
        await page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                var totalHeight = 0;
                var distance = 100;
                var timer = setInterval(() => {
                    var scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });

        await page.waitForTimeout(5000);


        const data = await page.evaluate(() => {
            const name = document.querySelectorAll('span[itemprop="name"]');

            if(!name?.length > 0) return;

            return[...name].map((name) => {
                return {
                    name: name.innerText
                }
            }
            )
        });

        // Save data in a JSON file
        fs.writeFile('data.json', JSON.stringify(data), (err) => {
            if (err) {
                console.log(err);
            }
        });
       
    }
}

scrapeData();
