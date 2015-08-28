window.addEventListener('scroll', showbars);
function showbars(){
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  var elements = document.querySelectorAll('.Diagram-bars');
  Array.prototype.forEach.call(elements, function(el, i){
    var bCR = el.getBoundingClientRect();
    if(bCR.top > 50 && bCR.top+bCR.height+50 < h)
      el.classList.add('Diagram-bars--animate');
    else
      el.classList.remove('Diagram-bars--animate');
  });
}
