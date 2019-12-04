$(function() {
    $('.scroll-down').click (function() {
      $('html, body').animate({scrollTop: $('#btn').offset().top }, 'slow');
      return false;
    });
  });


  $(function() {
    $('.scroll-down2').click (function() {
      $('html, body').animate({scrollTop: $('.container1').offset().top }, 'slow');
      return false;
    });
  });