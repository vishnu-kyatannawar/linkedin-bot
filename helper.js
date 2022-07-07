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

async function shareAndLike(page) {
  await page.evaluate(async () => {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    // Fetch all post like buttons which are not liked yet
    let likeButtons = document.querySelectorAll('span.reactions-react-button > button[aria-pressed = "false"]');

    // Function to like and share
    async function shareAndLike () {
      for (i = 0; i < likeButtons.length; i++) {
        let currPostLikeBtn = likeButtons[i];
        let shareIcon = currPostLikeBtn.closest('div.feed-shared-social-actions').querySelector('[type="share-linkedin-icon"]');
	      shareIcon.click();

        // Wait for 0.5 seconds and then click on repost and like button
        await delay(1000);	      
	      let reportBtn = shareIcon.closest('.feed-shared-social-action-bar__action-button').querySelector('div.social-reshare-button__sharing-as-is-dropdown-item');
	      reportBtn.click()        
        currPostLikeBtn.click();

        // Wait for 0.5 seconds and then move to next button
        await delay(1000);
      }      
    }
    
    await shareAndLike();
  });
}

export const helper = {
  // All helper methods will be added here
  delay: delay,
  scrollUntilElement: scrollUntilElement,
  shareAndLike: shareAndLike
};
