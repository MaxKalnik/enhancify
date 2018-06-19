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




  // $('#checkbox').change(function(){
  //   setInterval(function () {
  //       moveRight();
  //   }, 3000);
  // });

  // var slideCount = $('#slider ul li').length;
  // var slideWidth = $('#slider ul li').width();
  // var slideHeight = $('#slider ul li').height();
  // var sliderUlWidth = slideCount * slideWidth;

  // $('#slider').css({ width: slideWidth, height: slideHeight });

  // $('#slider ul').css({ width: sliderUlWidth, marginLeft: - slideWidth });

  // $('#slider ul li:last-child').prependTo('#slider ul');

  // function moveLeft() {
  //     $('#slider ul').animate({
  //         left: + slideWidth
  //     }, 200, function () {
  //         $('#slider ul li:last-child').prependTo('#slider ul');
  //         $('#slider ul').css('left', '');
  //     });
  // };

  // function moveRight() {
  //     $('#slider ul').animate({
  //         left: - slideWidth
  //     }, 200, function () {
  //         $('#slider ul li:first-child').appendTo('#slider ul');
  //         $('#slider ul').css('left', '');
  //     });
  // };

  // $('.testimonials__list-controls--left').click(function () {
  //     moveLeft();
  // });

  // $('.testimonials__list-controls--right').click(function () {
  //     moveRight();
  // });
});

