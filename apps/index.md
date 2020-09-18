---
layout: page.njk
title: Apps On The Web!
description: A variety of web applications I've built (for a variety of reasons)
---
I've built a variety of web applications both as useful utilities, like displaying data from our home weather station, and as projects to learn more about the web.  They're all listed here, and available via links.

<ul>
{%- for app in collections.app -%}
  <li>
  	<a href="{{ app.url }}">{{ app.data.title }}</a> 
  	{%- if app.data.description -%} -- {{ app.data.description }} {%- endif -%}
  </li>
{%- endfor -%}
</ul>