# Display Flash messages in Rails app

```
<% flash.each do |key, value| %>
  <%= content_tag :div, value, class: "flash #{key}" %>
<% end %>
```
