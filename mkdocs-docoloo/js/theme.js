$(document).ready(function() {
  var scrollSpeed = 700; // in ms

  // Handle TOC anchor link scrolling
  $(document).on('click', '.toc a', function(e) {
    e.preventDefault();

    var offset = $($(this).attr('href')).offset().top;

    $('html,body').animate({
      scrollTop: offset + 'px'
    }, scrollSpeed);
  });

  // Handle back to top scrolling
  $(document).on('click', '.backtotop', function(e) {
    e.preventDefault();
    $('html,body').animate({
      scrollTop: '0px'
    }, scrollSpeed);
  });

  // Handle nav toggle button
  $(document).on('click', '.nav-toggle', function(e) {
    $('.navigation').slideToggle()
    if ($(this).text() == 'Menü') {
      $(this).text('Schließen');
    } else {
      $(this).text('Menü');
    }
  });
});

$(document).ready(function () {
  var last_scroll_pos;
  last_scroll_pos = 0;
  return $(window).scroll(function (e) {
    var pos, s, w;
    s = $('.navigation');
    w = $(window);
    if (s.height() > w.height()) {
      if (last_scroll_pos > $('html,body').scrollTop()) {
        if (parseInt(s.css('top')) < 0) {
        console.log('test');
        s.css('top', parseInt(s.css('top')) + last_scroll_pos - $('html,body').scrollTop());
        } else {
          s.css('top', '0px');
        }
      } else {
        pos = $(window).height() + $('html,body').scrollTop();
        if (parseInt(s.css('top')) > (s.height() - w.height()) * -1) {
        s.css('top', parseInt(s.css('top')) + last_scroll_pos - $('html,body').scrollTop());
        } else {
          s.css('top', (s.height() - w.height()) * -1);
        }
      }
    }
    return last_scroll_pos = $('html,body').scrollTop();
  });
});
