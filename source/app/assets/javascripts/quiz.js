var router = (function() {
  function init() {
    $('.container').on('click', '.quiz-link', quizzesController.loadQuiz);
    $('.choice-list a').on('click', 'a', choicesController.answerChoice);
  }

  return {
    init: init
  }
}())

var quizzesController = (function() {

  function showQuizzes(e) {
    $.ajax({
      type: "GET",
      url: "/quizzes.json"
    })
    .done(function(serverResponse) {
      renderQuizList(serverResponse.quizzes)
    })
  }

  function renderQuizList(quizzes) {
    var $quizListTemplate = $($("#quiz-list-template").html())
    for (var i = 0; i < quizzes.length; i += 1) {
      renderQuiz($quizListTemplate, quizzes[i])
    }
    $(".container").append($quizListTemplate)
  }

  function renderQuiz($quizListTemplate, quiz) {
    var $quizTemplate = $($("#quiz-template").html())
    var $quizAnchor = $quizTemplate.find('a')
    $quizAnchor.html(quiz.name).attr('href', "/quizzes/"+quiz.quiz_id)
    $quizAnchor.data('id', quiz.quiz_id)
    $quizListTemplate.append($quizTemplate)
  }

  function loadQuiz(event) {
    event.preventDefault()
    var QuizId = $(event.target).data('id');
    window.history.pushState(QuizId, "QuestionsView", "/quizzes/" + QuizId);
    QuestionsController.showQuestion();
    // location.hash = "/quizzes/" + $(event.target).data('id') ***pushState is the preferred method here***
  }

  return {
    showQuizzes: showQuizzes,
    loadQuiz: loadQuiz
  }
}());

var QuestionsController = (function() {

  function showQuestion() {
    var quizNumber = event.target.href.substr(-1)
    $.ajax({
      type: "GET",
      url: "/quizzes/" + quizNumber + "/questions/next.json",
      data: { session_key: 'a124f87dec55da23'}
    })
    .done(function(serverResponse) {
      renderQuestion(quizNumber, serverResponse.question)
    })
  }

  function renderQuestion(quizNumber, questions) {
    var $questionTemplate = $($("#question-template").html())
    var $questionAnchor = $questionTemplate.find('h3')
    $questionAnchor.html(questions.question)
    $(".container").append($questionTemplate)
    choicesController.renderChoices(quizNumber, questions);
  }

  return {
    showQuestion: showQuestion
  }

}());

var choicesController = (function() {
  function renderChoices(quizNumber, choices) {
    for (var i = 0; i < choices.choices.length; i += 1) {
      $('.choice-list').append("<li><a href='#'>" + choices.choices[i].choice) + "</a></li>" //Having some link problems here. What's the deal?
    }
  }
// '/quizzes/" + quizNumber + "/questions/next'
  function answerChoice(event) {
    event.preventDefault();
    debugger
    $.ajax({
      type: "POST",
      url: "/quizzes/1/questions.next.json",
      data: event.target.serialize()
    })
    .done(function(serverResponse) {
      console.log("done")
    })
  }
  return {
    renderChoices: renderChoices,
    answerChoice: answerChoice
  }
}());

$(function() {
  router.init()
  quizzesController.showQuizzes()
});