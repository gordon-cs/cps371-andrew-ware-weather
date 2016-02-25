function setActiveDay(n) {
  for (var i = 0; i < 7; i++) {
    if (i != n) {
      $('#day' + i).attr('class', '');
    }
    else $('#day' + i).attr('class', 'active');
  }
}
