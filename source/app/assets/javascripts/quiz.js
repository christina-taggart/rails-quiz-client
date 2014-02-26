var getQuizzes = function() {
  $.ajax({
    type: 'get',
    url: '/quizzes.json'
  })
  .done(function(json) {
    quizzes = json.quizzes
    for (var i=0; i < quizzes.length; i++) {
      quiz = quizzes[i];
      $('.container').append(Quiz.render(quiz));
    }
  })
  .fail(function() {
    $('.container').append('Quizzes not found!');
  })
}

var Quiz = {
  render: function(quiz) {
    return "<div><h2>" + quiz.name + "</h2></div>";
  }
}


// On document ready:
$( document ).ready(function() {
  getQuizzes();
})