---
layout: article.njk
title: Enabling Dark Mode Support
description: Easily enabling automatically dark mode support on a web page/site using CSS, as I've done here on disquisitioner.com
date: 2020-01-11T10:44-08:00
monetized: true
tags: [article, webdev]
---
Motivated by Deja Hodge's [excellent video](https://www.youtube.com/watch?v=jmepqJ5UbuM) on the Mozilla Developer channel on YouTube (which is where I get _lots_ of inspiration and insight about building things for the web), I wanted to add dark mode support to disquisitioner.com.  I've started to use dark mode on my Windows, MacOS, iOS and Android devices and have seen an increasing number of web sites support both.

Dark mode is tied to a user preference, which is set in a variety of ways depending on platform and opertaing system.  Happily CSS makes it easy to recognize and react to that user preference through a CSS media query.  Adding:
```css
@media (prefers-color-scheme:dark) {
    ...
}
```
to your stylesheets gives you a way to introduce style rules that will apply automatically whenver dark mode is detected.

As Deja's video points out, the complicated part of adding dark mode support is not enabling styling, it's working out the two different color schemes for your site -- one for light mode and one for dark mode.

In my case I use a variety of colors in a number of places in my stylesheets to specify element coloration alongside the other styling for that element.  To make all that dynamically configurable the programmer part of my brain immediately wanted to switch to using variables to hold and specify element coloring.  That led me to discover [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties), which are perfect for this task.

In the simplest case, here's basic dark mode support using CSS custom properties (variables):
```css
:root {
    --page-background: #fff;     /* white */
    --text-color: #000;          /* black */
}
@media (prefers-color-scheme: dark) {
  :root {
    --page-background: #121212;  /* very dark grey */
    --text-color: #fff;          /* white */
  }
}
html {
  background-color: var(--page-background);
  color: var(--text-color);
}
```
To help me select a good mix of colors for dark mode I found the Material System's [Dark Mode Guide](https://material.io/design/color/dark-theme.html) quite useful.

Equipped with those tools it was easy to edit my style sheets to introduce automatic dark mode detection and define proper values for variables used throughout to set element coloration.  As a side benefit, this helped me make my web site color scheme more consistent by recognizing similarities in elements used for different visual purposes and coloring them all the same (e.g. the various places I was using separators in text, menus, headers and footers).

ps: Thanks, Deja!
