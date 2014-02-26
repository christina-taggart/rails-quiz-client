//-----QUIZ MODULE-----
var Quiz = (function() {
  var _render = function(quiz) {
      return "<div class='quiz' id='quiz" + quiz.quiz_id +"'><h2><a data-id=" + quiz.quiz_id + " href='/quizzes/" + quiz.quiz_id + "/questions/next.json'>" + quiz.name + "</a></h2><div class='question'></div></div>";
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


//-----QUESTION MODULE-----
var Question = (function() {
  var _render = function(question) {
    return question.question + "<form method='post' action='/questions/" + question.question_id + "/answers.json'>" + Choice.renderAll(question.choices) + "</form>";
  }

  var _appendQuestion = function(json) {
    question = json.question;
    quizId = question.choices[0].quiz_id;
    $("#quiz" + quizId + " .question").html(_render(question));
  }

  var _appendError = function() {
    $(".container").append("Question not found!");
  }

  return {
    getNextQuestion: function(quizId) {
      $.ajax({
        type: 'get',
        url: "/quizzes/" + quizId + "/questions/next.json",
        data: { session_key: sessionKey }
      })
      .done(_appendQuestion)
      .fail(_appendError)
    }
  }
})()


//-----CHOICE MODULE-----
var Choice = {
  renderAll: function(choices) {
    choicesHtml = "";
    for (var i=0; i < choices.length; i++) {
      choice = choices[i];
      choicesHtml += "<input type='radio' name='answer' value='" +choice.choice + "'>" + choice.choice
    }
    return choicesHtml
  }
}