var sessionKey = Math.floor((Math.random()*1000000));

$(function() {
  QuizzesController.init();
  QuestionsController.init();
});


QuizzesController = (function() {

  function _init() {
    _loadQuizzes();
  }

  function _loadQuizzes() {
    $.ajax({
      method: "GET",
      url:    "/quizzes.json"
    }).done(function(response) {
      for (var i in response.quizzes) {
        render(response.quizzes[i]);
      }
    }).fail(function() {
      console.log('Request Failed');
    })
  }

  function render(quiz) {
    var $template =  $($('#quiz-template').html());
    $template.find('a').html(quiz.name).attr('href', '/quizzes/' + quiz.quiz_id );
    $('#quiz-list').append($template);
  }

  return {
      init: _init
    , loadQuizzes: _loadQuizzes
  }

}())


QuestionsController = (function(){
  function bindQuizLinks() {
    $('#quiz-list').on( 'click', 'a.quiz-link', getQuestion);
  }

  function getQuestion(event) {
    event.preventDefault();
    var link = $(event.target).attr('href')
    var _url = link + '/questions/next.json'
    $.ajax({
        url: _url,
        data: {session_key: sessionKey},
        method: "GET"
    }).done(function(response) {
        location.hash += link
        render(response.question)
    }).fail(function() {
        console.log("failure")
    });
  }

  function render(question) {
    var $template = $($('#question-template').html());
    $template.find(".title").html(question.question);
    $('.question-container').append($template);
    debugger;
  }

  function _init() {
    bindQuizLinks();
  }

  return {
    init: _init
  }
}())








