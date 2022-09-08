const puppeteer = require('puppeteer');

async function scrape(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto(url);
    await page.waitForSelector(".yuRUbf");
   const results = await page.evaluate(() => {
       const searchResults = document.querySelectorAll(".yuRUbf");
       const temp = [];
       searchResults.forEach((searchitem) => {
           let item = {
                heading: searchitem.querySelector(".yuRUbf .LC20lb.MBeuO.DKV0Md").innerHTML,
                link: searchitem.querySelector(".yuRUbf a").href
           };
           temp.push(item);
       });
       return temp;
   });

   require("fs").writeFile("results.json", JSON.stringify(results), () => {});
   await browser.close();
}scrape('https://google.com/search?q=floristerias').catch((err) => {
    console.log(err);
})