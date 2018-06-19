$(document).ready(function () {
    var body = $('body');
    $('select').each(function(){
      var $this = $(this), numberOfOptions = $(this).children('option').length;

      $this.addClass('select-hidden');
      $this.wrap('<div class="select"></div>');
      $this.after('<div class="select-styled"></div>');

      var $styledSelect = $this.next('div.select-styled');
      $styledSelect.text($this.children('option').eq(0).text());

      var $list = $('<ul />', {
          'class': 'select-options'
      }).insertAfter($styledSelect);

      for (var i = 0; i < numberOfOptions; i++) {
          $('<li />', {
              text: $this.children('option').eq(i).text(),
              rel: $this.children('option').eq(i).val()
          }).appendTo($list);
      }

      var $listItems = $list.children('li');

      $styledSelect.click(function(e) {
          e.stopPropagation();
          $('div.select-styled.active').not(this).each(function(){
              $(this).removeClass('active').next('ul.select-options').hide();
          });
          $(this).toggleClass('active').next('ul.select-options').toggle();
      });

      $listItems.click(function(e) {
          e.stopPropagation();
          $styledSelect.text($(this).text()).removeClass('active');
          $this.val($(this).attr('rel'));
          $list.hide();
      });

      $(document).click(function() {
          $styledSelect.removeClass('active');
          $list.hide();

      });
    });


    var index, bullets, $slider, $sliderLength, $left_btn, $right_btn, $sliderWidth, $slideWidth;
    function initVars() {
      index = 0;
      $bullets = $('.testimonials__pointers-item');
      $slider = $('.testimonials__slides-list');
      $sliderLength = $('.testimonials__list-item').length;
      $left_btn = $('.testimonials__list-controls--left');
      $right_btn = $('.testimonials__list-controls--right');
      $sliderWidth = $('.testimonials__slides-list').width();
      $slideWidth = $sliderWidth / $sliderLength;
      document.querySelector(".testimonials__slides-list").style.transform = "translateX(0)";
    };

    initVars();

    function checkBullets() {
      $bullets.removeClass('testimonials__pointers-item--active');
      $($bullets[index]).addClass('testimonials__pointers-item--active');
    };
    checkBullets();

    function checkUI() {
      if(index > 0 && index < $sliderLength - 1) {
        $($left_btn).removeClass('testimonials__list-controls--inactive');
      }
      else if (index === 0) {
        $($left_btn).addClass('testimonials__list-controls--inactive');
        $($right_btn).removeClass('testimonials__list-controls--inactive');
      }
      else if(index === $sliderLength - 1) {
        $($right_btn).addClass('testimonials__list-controls--inactive');
        $($left_btn).removeClass('testimonials__list-controls--inactive');
      }
    };

    function next() {
      checkUI();
      if(index === $sliderLength - 1) {
        var range = 0;
      } else {
        var range = $slideWidth + $slideWidth * index;
      }
      document.querySelector(".testimonials__slides-list").style.transform = "translateX(-" + range + "px)";
      if(index === $sliderLength - 1) {
        index = 0;
      } else {
        index++;
      }
      checkBullets();
      checkUI();
    };

    function prev() {
      if(index === 0) {
        var range = -$slideWidth * ($sliderLength - 1);
      } else {
        var range = ($slideWidth - $slideWidth * index);
      }
      document.querySelector(".testimonials__slides-list").style.transform = "translateX(" + range + "px)";
      if(index === 0) {
        index =  $sliderLength - 1;
      } else {
        index--;
      }
      checkBullets();
      checkUI();
    };

    body.on('click', '.testimonials__list-controls--left', function() {
      prev();
    });
    body.on('click', '.testimonials__list-controls--right', function() {
      next();
    });
    body.on('click', '.testimonials__pointers-item', function(evt) {
      var id = $(this).data('id');
      document.querySelector(".testimonials__slides-list").style.transform = "translateX(-" + ($slideWidth * (+id)) + "px)";
      index = id;
      checkBullets();
      checkUI();
    });

    $(window).resize(throttle(initVars, 500, {leading: false}))

    body.on('click', '.main-nav__toggle', function(){
      $(this).toggleClass('main-nav__toggle--opened');
      $('.main-nav').toggleClass('main-nav--opened');
      $('.header__contacts').toggleClass('header__contacts--menu-active');
      $('.header__content').toggleClass('header__content--active');
    });
    body.on('click','.main-nav__list-item--hovered', function () {
      $(this).children('.main-nav__sub-list').toggleClass('main-nav__sub-list--active');
    });
    $(function() {
      $(".testimonials__list-item").swipe( {
        swipeLeft:function(event, direction, distance, duration, fingerCount, fingerData) {
          next()
        },

        swipeRight:function(event, direction, distance, duration, fingerCount, fingerData) {
          prev()
        },
         threshold: 15
      });
    });
});
