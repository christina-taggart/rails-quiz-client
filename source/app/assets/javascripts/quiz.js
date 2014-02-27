var Router = (function() {
  function init() {
    $('.container').on('click', '.quiz-link', QuizzesController.loadQuiz);
    // $('.container').on('click', '.choice-link', QuizzesController.loadQuiz);
  }

  return {
    init: init
  }
}())

var QuizzesController = (function() {

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
    $.ajax({
      type: "GET",
      url: "/quizzes/" + event.target.href.substr(-1) + "/questions/next.json",
      data: { session_key: 'a124f87dec55da23'}
    })
    .done(function(serverResponse) {
      renderQuestion(serverResponse.question)
    })
  }

  function renderQuestion(questions) {
    var $questionTemplate = $($("#question-template").html())
    $('.question')
    debugger
    // .append($questionTemplate)
    // choicesController.renderChoices(questions);
  }

    // var $quizTemplate = $($("#quiz-template").html())
    // var $quizAnchor = $quizTemplate.find('a')
    // $quizAnchor.html(quiz.name).attr('href', "/quizzes/"+quiz.quiz_id)
    // $quizAnchor.data('id', quiz.quiz_id)
    // $quizListTemplate.append($quizTemplate)

  return {
    showQuestion: showQuestion
  }

}());

var choicesController = (function() {
  function renderChoices(choices) {
  }

  return {
    renderChoices: renderChoices
  }
}());

$(function() {
  Router.init()
  QuizzesController.showQuizzes()
});