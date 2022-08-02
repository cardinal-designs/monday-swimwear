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
      var icon = '<svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L7 7L13 1" stroke="black"/></svg>';
      link.html(text+icon);
      list.slideToggle(200);
      if (text === '* Reset') {
        link.html('Select one option'+icon);
      }
  
      var $mobcurrent = $(e.currentTarget),
          mobindex = $mobcurrent.index();
      $mobtabslis.removeClass('active-tab');
      $mobcurrent.addClass('active-tab');
      $mobcontentlis.hide().eq(mobindex).show();
    });
  });
});