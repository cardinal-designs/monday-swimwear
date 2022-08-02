jQuery(document).ready(function($){

  $(function () {
  
    var activeIndex = $('.active-tab').index(),
        $contentlis = $('.tabs-content > div'),
        $tabslis = $('.tabs li');
  
    // Show content of active tab on loads
    $contentlis.eq(activeIndex).show();
  
    $('.tabs').on('click', 'li', function (e) {
      var $current = $(e.currentTarget),
          index = $current.index();
      $tabslis.removeClass('active-tab');
      $current.addClass('active-tab');
      $contentlis.hide().eq(index).show();
    });
  });

  $(function() {
    var list = $('.Custom_Dropdown_List');
    var link = $('.Js_Link');
    
    var mobactiveIndex = $('.active-tab').index(),
        $mobcontentlis = $('.tabs-content > div'),
        $mobtabslis = $('.Custom_Dropdown_List li');
  
    link.click(function(e) {
      e.preventDefault();
      $(this).toggleClass('active');
      list.slideToggle(200);
    });
    
    list.find('li').click(function(e) {    
      var text = $(this).html();
      link.html(text+icon);
      list.slideToggle(200);
      if (text === '* Reset') {
        link.html('Select one option');
      }
  
      var $mobcurrent = $(e.currentTarget),
          mobindex = $mobcurrent.index();
      $mobtabslis.removeClass('active-tab');
      $mobcurrent.addClass('active-tab');
      $mobcontentlis.hide().eq(mobindex).show();
    });
  });
});