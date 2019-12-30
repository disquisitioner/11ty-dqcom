---
layout: page.njk
title: Apps On The Web!
---
I've built a variety of web applications both as useful utilities, like displaying data from our home weather station, and as projects to learn more about the web.  They're all listed here, and available via links.

<ul>
{%- for app in collections.app -%}
  <li>
  	<a href="{{ app.url }}">{{ app.data.appTitle }}</a> 
  	{%- if app.data.appDescription -%} -- {{ app.data.appDescription }} {%- endif -%}
  </li>
{%- endfor -%}
</ul>