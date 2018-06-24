// google map api
function initMap() {
  var place = {lat: 40.746724, lng: -73.983998};
  var map = new google.maps.Map(
  document.getElementById('map'), {zoom: 16, center: place});
  var marker = new google.maps.Marker({position: place, icon: 'images/svg/map_marker.svg', map: map});
}

var body = $('body');
// custom select elements
function makeSelectCustom(element) {
  element.each(function(){
    var $this = $(this), numberOfOptions = $(this).children('option').length;

    $this.addClass('select-hidden');
    $this.wrap('<div class="select"></div>');
    $this.after('<div class="select-styled"></div>');

    var $styledSelect = $this.next('div.select-styled');
    if($this.data('placeholder')) {
      $styledSelect.text($this.data('placeholder'));
    }

    var $list = $('<ul />', {
        'class': 'select-options'
    })

    var $selected;
    var $selectedInd;

    for (var i = 0; i < numberOfOptions; i++) {
      if($this.children('option').eq(i).is(':selected')) {
        $selected = $this.children('option').eq(i);
        $selectedInd = i;
      }
      $('<li />', {
          class: 'select-item',
          text: $this.children('option').eq(i).text(),
          rel: $this.children('option').eq(i).val()
      }).appendTo($list);
    }

    $list.insertAfter($styledSelect);

    var $listItems = $list.children('li');

    if($selected) {
      $styledSelect.text($selected.text());
      $($listItems[$selectedInd]).hide();
    }

    $styledSelect.click(function(e) {
        e.stopPropagation();
        $('div.select-styled.active').not(this).each(function(){
            $(this).removeClass('active').next('ul.select-options').hide();
        });
        $(this).toggleClass('active').next('ul.select-options').toggle();
    });

    $listItems.click(function(e) {
        $listItems.show();
        e.stopPropagation();
        $styledSelect.text($(this).text()).removeClass('active');
        $this.val($(this).attr('rel'));
        $(this).hide();
        $list.hide();
    });

    $(document).click(function() {
        $styledSelect.removeClass('active');
        $list.hide();
    });
  });
};

function makeLinkedSelectCustom(element) {
  element.each(function(){
    var $this = $(this), numberOfOptions = $(this).children('.option').length;

    $this.addClass('select-hidden');
    $this.wrap('<div class="select"></div>');
    $this.after('<div class="select-styled"></div>');

    var $styledSelect = $this.next('div.select-styled');
    $styledSelect.text($this.children('.option').eq(0).text());

    var $list = $('<ul />', {
        'class': 'select-options'
    });

    for (var i = 0; i < numberOfOptions; i++) {
      var $linkItem = $(document.createElement('li'))
      $('<a />', {
          class: 'select-item-link',
          text: $this.children('.option').eq(i).text(),
          href: $this.children('.option').eq(i).attr('href')
      }).appendTo($linkItem);
      $linkItem.appendTo($list);
    }

    $list.insertAfter($styledSelect);

    var $listItems = $list.children('li').children('a');
    $listItems.eq(0).hide();

    $styledSelect.click(function(e) {
        e.stopPropagation();
        $('div.select-styled.active').not(this).each(function(){
            $(this).removeClass('active').next('ul.select-options').hide();
        });
        $(this).toggleClass('active').next('ul.select-options').toggle();
    });

    $listItems.click(function(e) {
        $listItems.show();
        e.preventDefault();
        e.stopPropagation();
        $styledSelect.text($(this).text()).removeClass('active');
        $this.attr('href', (($(this).attr('href'))));
        $(location).attr('href', $this.attr('href'));
        $(this).hide();
        $list.hide();
    });

    $(document).click(function() {
        $styledSelect.removeClass('active');
        $list.hide();
    });
  });
}
if($('#solutions-for').length) {
  makeLinkedSelectCustom($('#solutions-for'));
}

if($('.form__fieldset-select').length) {
  $('.form__fieldset-select').each(function() {
    makeSelectCustom($(this));
  })
}

// image slider
if($('.testimonials__slides-list').length) {
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
}

// upper navigation
body.on('click', '.main-nav__toggle', function(){
  $(this).toggleClass('main-nav__toggle--opened');
  $('.main-nav').toggleClass('main-nav--opened');
  $('.header__contacts').toggleClass('header__contacts--menu-active');
  $('.header__content').toggleClass('header__content--active');
});
body.on('click','.main-nav__list-item--hovered', function () {
  $(this).children('.main-nav__sub-list').toggleClass('main-nav__sub-list--active');
});

$(".testimonials__slides-list-wrapper").swipe( {
  swipeLeft:function(event, direction, distance, duration, fingerCount, fingerData) {
    next();
  },

  swipeRight:function(event, direction, distance, duration, fingerCount, fingerData) {
    prev();
  },
   allowPageScroll: "vertical",
   threshold: 35
});

// faq accordion
function toggleFaq(isAccordion) {
  body.on('click', '.faqs__item-header', function() {
    $target = $(this);
    $item = $target.closest('.faqs__item');
    if(isAccordion) {
      if ($item.hasClass('faqs__item--active')) {
        $item.removeClass('faqs__item--active');
        return;
      }
      $('.faqs__item').removeClass('faqs__item--active');
      $item.addClass('faqs__item--active');
    } else {
      $item.toggleClass('faqs__item--active');
    }
  });
};
toggleFaq(true);

// about us graph accordion
function toggleGraphs() {
  body.on('click', '.analytics__item-title', function() {
    $target = $(this);
    $item = $target.closest('.analytics__item');
    $('.analytics__item').removeClass('analytics__item--active');
    $item.addClass('analytics__item--active');
  });
};
toggleGraphs();

// upper btn coloring
$btnInitOffset = $('.header__contacts-btn-get-started').offset().top;

$(window).on('scroll', function () {
  $('.header__contacts-btn-get-started').addClass('header__contacts-btn-get-started--scroll');
  if($btnInitOffset >= $('.header__contacts-btn-get-started').offset().top) {
    $('.header__contacts-btn-get-started').removeClass('header__contacts-btn-get-started--scroll');
  }
});

// hint
function hideHint() {
$('.form__fieldset-hint').removeClass('form__fieldset-hint--open');
  body.off('click', hideHint);
}

body.on('click', '.form__fieldset-label-hint-btn', function(evt) {
  evt.preventDefault();
  $(this).find('.form__fieldset-hint').addClass('form__fieldset-hint--open');
  body.on('click', hideHint);
});

body.on('click', '.form__fieldset-hint', function() {
  evt.preventDefault();
  $(this).removeClass('form__fieldset-hint--open');
});

body.on('click', '.form__fieldset-btn-file', function() {
  $('.form__fieldset-input--file').click();
});

// popup
$('.open-dialog').click(function(){
  $('.popup').show();
});
$('.popup__close-btn').click(function(){
  $('.popup').hide();
});
$('.popup__btn').click(function(){
  $('.popup').hide();
});

// ios detecting
var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
var iOS2 = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
