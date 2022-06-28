const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function scrollDown(page, scrollElementQuerySelector, topInPx) {
  console.log('Scrolling down');
  await page.evaluate((scrollElementQuerySelector, topInPx) => {
    document.querySelector(scrollElementQuerySelector).scrollBy({
      top: topInPx,
      behavior: 'smooth'
    });
  }, scrollElementQuerySelector, topInPx);
}

async function elementExists(page, xPath) {
  const element = await page.$x(xPath);

  if (element.length) {
    console.log('Last liked post found');
    return true;
  }

  return false;
}

async function scrollUntilElement(page, scrollElementQuerySelector, elementXPath) {
  const scrollPx = 2000;
  // For now using this as a hacky fix, will improve this later
  const maxScroll = 20;
  let scrollCount = 0;
  
  while(!await elementExists(page, elementXPath)) {
    await scrollDown(page, scrollElementQuerySelector, scrollPx);
    await delay(2000);

    if (scrollCount >= maxScroll) {
      return false;
    }

    scrollCount = scrollCount + 1;
  }

  return true;
}

async function likePosts(page) {
  await page.evaluate(() => {
    // Fetch all post like buttons which are not liked yet
    let likeButtons = document.querySelectorAll('span.reactions-react-button > button[aria-pressed = "false"]');
    likeButtons.forEach((likeButton) => {
      likeButton.click();
    });    
  });
}

export const helper = {
  // All helper methods will be added here
  delay: delay,
  scrollUntilElement: scrollUntilElement,
  likePosts: likePosts
};
