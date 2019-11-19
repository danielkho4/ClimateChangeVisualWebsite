$(function() {
    $('.scroll-down').click (function() {
      $('html, body').animate({scrollTop: $('.container1').offset().top }, 'slow');
      return false;
    });
  });