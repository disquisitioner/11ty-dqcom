---
layout: page.njk
title: Figuring out Eleventy (part 1)
subtitle: Not as easy as you'd think...
description: Lessons learned building this site using Eleventy, my first time effort with a static site generator.
date: 2019-12-26T13:44-08:00
tags: article
---
<h1>Getting Started</h1>
<p>
	I started out using Hylia and Netlify just to get started, which was super easy -- five minutes from idea to working website.  Awesome.
</p>
<h2>But The Documentation...</h2>
<p>
	Eleventy documentation is reasonably extensive, but not really well suited for learning from scratch.  If you're an experienced web developer familiar with today's tools and templating systems you have an advantage.  But even then a lot of the basics of static site generation aren't obvious from either the documentation or the examples.
</p>
<h3>Learning by Doing</h3>
<p>
	So I stopped trying to puzzle out Hylia and decided to start from scratch, installing Eleventy on my Mac and building a site page by page, saving myself the extra steps of git, github, and reload.
</p>

<h1>Important First Lessons</h1>
<p>
	Here are things I learned by trial and error, but which were key to being successful with Eleventy:
	<ul>
		<li>How the copy through mechanism works</li>
		<li>How to store/retrieve metadata using the _data subdirectory</li>
		<li>The special treatement of files named "index"</li>
		<li>Templating using Nunjucks, especially conditionals and loops</li>
		<li>The magic of tags and Eleventy Collections</li>
	</ul>
</p>