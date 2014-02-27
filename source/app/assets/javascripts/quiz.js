//-----QUIZ MODULE-----
var Quiz = (function() {
  var _render = function(quiz) {
      var handlebarTemplate = $('#quiz').html();
      var template = Handlebars.compile(handlebarTemplate);
      return template(quiz);
  }

  var _appendQuizzes = function(json) {
    quizzes = json.quizzes
    for (var i=0; i < quizzes.length; i++) {
      quiz = quizzes[i];
      $('.container').append(_render(quiz));
    }
  }

  var _appendError = function() {
    $('.errors').append('Quizzes not found!');
    setInterval(function() { $(".errors").empty() }, 3000)
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