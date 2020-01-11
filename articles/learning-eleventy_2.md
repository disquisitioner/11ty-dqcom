---
layout: page.njk
title: Figuring out Eleventy (part 2)
subtitle: Still not easy, but working!
description: Figuring out how to deploy to Netlify, plus further site feature development using Eleventy and Nunjucks.
date: 2019-12-30T08:35-08:00
tags: article
---
# First Painful Deploy
Installing Eleventy locally on my development machine made it super easy to iteratively build and test, especially thanks to Eleventy's continuous [serve & reload mode](https://www.11ty.dev/docs/usage/#re-run-eleventy-when-you-save).  Having gotten a basic site built leveraging lessons highlighted in [part 1](/articles/learning-eleventy/) of this series, I was ready to try deploying to Netlify.

That turned out to be easier said than done, even though I'd read through Netlify "getting started" documentation and already managed deploys as part of experimenting with Hylia.  I optimistically took my working local Eleventy code, created a new repo on github, and added that repo to my Netlify dashboard.  Having used `eleventy` as my build and deploy command locally I specified that as my build command in the Netlify dashboard along with `_site` as my deploy directory.  Seemed straightforward.

Build failed.

Well, that's odd.  Looking at the build log I could see Netlify couldn't find the command `eleventy`, but I didn't know how to tell it where to look.  Studying other example sites I noticed they used a local `netlify.toml` for Netlify configuration so I tried that. Build failed.  Searching for other build commands in other repos led me to try a number of other possibilities.  Build failed, every time.  I logged an issue on the Netlify discusssion forms and got a couple of helpful comments from folks sharing their configuration info, but they were largely doing what I was already doing.  What, I wondered, could possibly be wrong?

In comparing across the various working example repos I noticed they all had a `package.json` file and I didn't.  Could that be the problem?  Further exploration led me to a bit of [Eleventy documentation](https://www.11ty.dev/docs/getting-started/) I'd missed before.  Following those instructions created a `package.json` that also (importantly) included a reference to Eleventy as a dev dependency.  I added it to my repo and happily that did the trick.  Build succeeded!

In all this, I wonder why I hadn't seen `package.json` mentioned in Netlify's documentation anywhere, nor had I seen Eleventy mentioned among their examples of build environments.  Ah well.

# Back to Site Development!

Having finally conquered the build and deploy process through Netlify, I went back to enhancing my site.  Further experimentation led to new insights:
* How YAML and Eleventy manage dates on posts, allowing me to add posted dates to my posts and display them on the site
* Updating my home page so it automatically includes all my posts (but just posts), creating a blog-style page that provides the sort of chronological timeline I was looking for.
* Creating a Photos page that can, through the magic of Eleventy tags, automatically gather photos from my posts and articles and display them in a single gallery.  (The formatting for the gallery is courtesy of Jen Simmon's [awesome work](https://labs.jensimmons.com/).  Thanks, Jen!)
* Creating an "about me" section at the top of my home page that could serve as my Indieweb `h-card`, and adding Indieweb [microformats](http://microformats.org/wiki/Main_Page) to my articles and posts.
* Discovering how easy it was to take my existing, stand-alone web apps and link them into my Eleventy-based site just by putting the HTML, Javascript, and CSS files in the proper places and doing a minor bit of tweaking (mostly to the HTML).

# What's Next?

There's lots more to come, though, like adding a page footer (for apps pages, mostly), seeing if I like drop-down menus for the main nav bar, getting a better handle on formatting dates, and brining more Indieweb features into the mix.
