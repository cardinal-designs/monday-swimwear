jQuery(document).ready(function($){



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
      var icon = '<svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M11 0.5L6 5.5L1 0.5" stroke="black" stroke-width="1.25"/> </svg>';
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