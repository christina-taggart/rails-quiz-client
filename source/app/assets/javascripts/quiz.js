//-----QUIZ MODULE-----
var Quiz = (function() {
  var _render = function(quiz) {
      return "<div class='quiz' id='quiz" + quiz.quiz_id +"'><h2><a data-id=" + quiz.quiz_id + " href='/quizzes/" + quiz.quiz_id + "/questions/next.json'>" + quiz.name + "</a></h2><div class='question'></div><div class='result'></div></div>";
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