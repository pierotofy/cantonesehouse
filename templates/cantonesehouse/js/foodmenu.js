$(function() {
    FastClick.attach(document.body);
});

function showMenu(id){
  $(document).focus();

   $("#" + id).animate({
    opacity: 'toggle',
    height: 'toggle'   
  }, {
    duration: 800, 
    specialEasing: {
      opacity: 'swing',
      height: 'swing'
    }
  });
}
