---
layout: default
title: 블로그/기술문서
permalink: /development/
---
<h1>블로그/기술문서</h1>
{% assign cat_posts = site.posts | where_exp: "post", "post.categories contains '블로그/기술문서'" %}
{% for post in cat_posts %}
<div style="padding:12px 0; border-bottom:1px solid #333;">
  <a href="{{ post.url }}">{{ post.title }}</a>
  <span style="color:#888; float:right;">{{ post.date | date: "%Y.%m.%d" }}</span>
</div>
{% endfor %}
