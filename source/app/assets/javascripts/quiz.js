//-----QUIZ MODULE-----
var Quiz = (function() {
  var _render = function(quiz) {
      return "<div class='quiz'><h2>" + quiz.name + "</h2><div class='question'></div></div>";
    }

  var _appendQuizzes = function(json) {
    quizzes = json.quizzes
    for (var i=0; i < quizzes.length; i++) {
      quiz = quizzes[i];
      $('.container').append(_render(quiz));
    }
  }

  var _appendError = function() {
    $('.container').append('Quizzes not found!');
  }

  return {
    getQuizzes: function() {
      $.ajax({
        type: 'get',
        url: '/quizzes.json'
      })
      .done(_appendQuizzes)
      .fail(_appendError)
    }
  }
})()


//-----ON DOCUMENT READY-----
$( document ).ready(function() {
  session_key = KeyGenerator.randomKey()
  Quiz.getQuizzes();
})