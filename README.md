# linkedin-auto-like
Puppeteer script is used to like recent company posts.

# About the script
This script uses headless chrome to automate user actions to like linkedIn posts of a company.

# Requirements

- Node v16

# Steps

- Open browser
- Go to LinkedIn sign-in page
- Enter provided credentials to login
- Navigate to company page
- Sort posts by recent posts
- Scroll down until we find a post which is liked previously
- If there is no previously liked post then we stop after 20 scrolls (approx 20 posts)
- Like all new posts (considering any post as new which is not liked previously)
- Close the browser

# Usage

```
LINKEDIN_EMAIL_ADDRESS='<linkedIn email address>' LINKEDIN_PASSWORD='<password>' node main.js '<LinkedIn Company Posts URL>'
```

# Todos

- [ ] Logging
- [ ] Clear error handling
- [ ] Docker setup
- [ ] Move to typescript
- [ ] Re-share posts
- [ ] Notification in case of error