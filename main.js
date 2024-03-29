import { argv } from 'node:process';
import { helper } from './helper.js';
import puppeteer from 'puppeteer';
const debuggingMode = false;

// Company posts page
const loginPage = 'https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin';
const pageLinks = argv.splice(2);
const emailAddress = process.env.LINKEDIN_EMAIL_ADDRESS;
const password = process.env.LINKEDIN_PASSWORD;

(async () => {
  console.log(`Started script at ${new Date()}`);
  const launchOptions = {};

  if (debuggingMode) {
    // Allow user to see what is happening on the browser
    launchOptions.headless = false;
    // slow down by 350ms
    launchOptions.slowMo = 10;
  }

  // Create a browser instance
  const browser = await puppeteer.launch(launchOptions);

  // Create a new page
  const page = await browser.newPage();

  // Set view port so that we can see what our script is doing
  if (debuggingMode) {
    await page.setViewport({ width: 1920, height: 1080 });
  }

  await page.goto(loginPage, { waitUntil: 'networkidle0' });
  await page.type('#username', emailAddress);
  await page.type('#password', password);
  await page.click('button[type=submit]');
  await helper.delay(10000);

  // Loop over each page
  for(let i = 0; i < pageLinks.length; i++) {
    const pageLink = pageLinks[i];
    console.log(`Process started for: ${pageLink}`);

    // Now go to company page link since we are signed in
    await page.goto(pageLink);

    // Wait until the company post page loads
    await page.waitForSelector('.sort-dropdown__dropdown > button', { visible: true, timeout: 0 });

    // Click on sort dropdown and click on recent posts
    await page.click('.sort-dropdown__dropdown > button');

    // FIXME: Checking if dropdown is show after some delay, so added this delay
    await helper.delay(5000);
    const sortDropDown = await page.$x('//button[contains(., "Recent")]');
    await sortDropDown[0].click();

    // Now we have to scroll down till the last liked post
    // It does not guarantee that it will cover all posts, since there might be posts which are liked manually in between
    // Also we don't want to scroll through all the posts
    const likedButtonXpath = '//span[contains(@class, "reactions-react-button")]/button[@aria-pressed = "true"]'
    const elementFound = await helper.scrollUntilElement(page, 'html', likedButtonXpath);

    // Case when there is no history of last liked post
    if (!elementFound) {
      console.log('We did not find any previously liked post');
    }

    await helper.shareAndLike(page);

    console.log('Liked and shared all new posts');
    await helper.delay(2000);
  }

  await browser.close();
})();
