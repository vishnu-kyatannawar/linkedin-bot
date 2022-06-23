import { argv } from 'node:process';
import { helper } from './helper.js';
import puppeteer from 'puppeteer';
const debuggingMode = true;

// Company posts page
const pageLink = 'https://www.linkedin.com/company/incidentreporter365/posts/?feedView=all';
const username = argv[2];
const password = argv[3];

(async () => {
  const launchOptions = {};

  if (debuggingMode) {
    // Allow user to see what is happening on the browser
    launchOptions.headless = false;
    // slow down by 350ms
    launchOptions.slowMo = 100;
  }

  // Create a browser instance
  const browser = await puppeteer.launch(launchOptions);

  // Create a new page
  const page = await browser.newPage();

  // Set view port so that we can see what our script is doing
  if (debuggingMode) {
    await page.setViewport({ width: 1920, height: 1080 });
  }  

  await page.goto(pageLink, { waitUntil: 'networkidle0' });
  await helper.delay(5000);
  // Sometimes noticed that instead of sign in we see join now page
  // If that happens we can use the below line of code to redirect to sign in page
  // await page.click('[data-tracking-control-name="auth_wall_desktop_company-login-toggle"]');
  await page.type('#username', username);
  await page.type('#password', password);
  await page.click('button[type=submit]');
  
  // Wait until the company post page loads 
  await page.waitForSelector('button[data-control-name="feed_sort_dropdown_trigger"]', { visible: true, timeout: 0 });
  
  // Click on sort dropdown and click on recent posts
  await page.click('button[data-control-name="feed_sort_dropdown_trigger"]');
  const sortDropDown = await page.$x('//button[contains(., "Recent")]');
  await sortDropDown[0].click();

  await helper.delay(5000);
  await browser.close();
})();
