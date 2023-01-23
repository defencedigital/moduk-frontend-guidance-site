---
layout: layouts/markdown-content-page.njk
title: Back link
tags: components
---

{%- from "components/code-snippet/macro.njk" import guidanceCodeSnippet -%}

Content to be added.

## HTML

{% call guidanceCodeSnippet({ language: "html" }) %}
{% raw %}<a href="#" class="govuk-back-link">Back</a>
{% endraw %}
{% endcall %}

## Nunjucks

{% call guidanceCodeSnippet({ language: "jinja2" }) %}
{% raw %}{% from "govuk/components/back-link/macro.njk" import govukBackLink %}
{{ govukBackLink({
  text: "Back",
  href: "#"
}) }}
{% endraw %}
{% endcall %}

