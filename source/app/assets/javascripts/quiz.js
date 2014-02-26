//-----QUIZ MODULE-----
var Quiz = (function() {
  var _render = function(quiz) {
      return "<div class='quiz" + quiz.quiz_id +"'><h2>" + quiz.name + "</h2><div class='question'></div></div>";
    }

  var _appendQuizzesAndQuestions = function(json) {
    quizzes = json.quizzes
    for (var i=0; i < quizzes.length; i++) {
      quiz = quizzes[i];
      $('.container').append(_render(quiz));
      Question.getNextQuestion(quiz.quiz_id);
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
      .done(_appendQuizzesAndQuestions)
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
    question = json.question
    $(".quiz" + quiz.quiz_id + " .question").append(_render(question));
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


//-----ON DOCUMENT READY-----
$( document ).ready(function() {
  sessionKey = KeyGenerator.randomKey()
  Quiz.getQuizzes();
})