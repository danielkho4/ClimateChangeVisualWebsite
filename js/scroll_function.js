$(function() {
    $('.scroll-down').click (function() {
      $('html, body').animate({scrollTop: $('.container3').offset().top }, 'slow');
      return false;
    });
  });