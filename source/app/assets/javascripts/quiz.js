var sessionKey = Math.floor((Math.random()*1000000));

$(function() {
  QuizzesController.init();
  QuestionsController.init();
  AnswersController.init();
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
  }

}())


QuestionsController = (function(){
  function bindQuizLinks() {
    $('#quiz-list').on( 'click', 'a.quiz-link', getInitialQuestion);
  }

  function changeTitle(newTitle) {
    var title = $(event.target).html();
    $('.current-quiz').html(title);
  }

  function getQuestion(url, linkHash) {
    $.ajax({
        url: url,
        data: {session_key: sessionKey},
        method: "GET"
    }).done(function(response) {
        location.hash = linkHash
        render(response.question);
    }).fail(function() {
        console.log("failure");
    });
  }

  function _getNextQuestion(url) {
    getQuestion(url);
  }

  function getInitialQuestion() {
    event.preventDefault();
    changeTitle(event)
    var linkHash = $(event.target).attr('href');
    var url = linkHash + '/questions/next.json';
    getQuestion(url, linkHash);
  }

  function render(question) {
    var $template = $($('#question-template').html());
    $template.find(".title").html(question.question);
    $form = $template.find("form");
    $form.find('.question-id').attr('value', question.question_id)
    $form.find('.session_key').attr('value', sessionKey)
    for ( var i in question.choices.reverse() ) {
      $form.prepend(render_choice(question.choices[i]));
    }
    $('.question-holder').html($template);
  }

  function render_choice(choice) {
    var $choice_template = $($('#choice-template').html());
    $choice_template.find('.choice-label').html(choice.choice);
    $choice_template.find('input.choice').attr('name', 'choice_id').attr('value', choice.choice_id);
    return $choice_template;
  }

  function _init() {
    bindQuizLinks();
  }

  return {
    init: _init,
    getNextQuestion: _getNextQuestion
  }
}())

AnswersController = (function(){
  function _init() {
    bindAnswerForm();
  }

  function bindAnswerForm() {
    $('.question-container').on('submit', 'form', processAnswer);
  }

  function processAnswer(event) {
    event.preventDefault();
    var questionId = $(event.target).find('.question-id').val()
    var formData = $(event.target).serialize()
    $.ajax({
      method: "POST",
      url: '/questions/' + questionId + '/answers.json',
      data: formData
    }).done(function(response) {
      updateNumCorrect(response.status.num_correct);
      updateNumIncorrect(response.status.num_incorrect);
      displayLastCorrect(response);
      var url = (location.hash + '/questions/next.json').substr(1);
      // debugger;
      if(response.status.more_questions){
        QuestionsController.getNextQuestion(url);
      }
      else {
        var $template =
        $('.question-holder').html('GAME OVER SUCKA');
      }
    }).fail(function() {
      console.log('Failed')
    })
  }

  function displayLastCorrect(response) {
    debugger;
    if(response.status.correct) {
      $('.correctness').html('Correct!').css('background-color', 'green').css('color', 'white');
    }
    else {
      $('.correctness').html('Wrong SUCKA!').css('background-color', 'red').css('color', 'white');
    }
  }

  function updateNumCorrect(newCorrect) {
    $('.correct').html(newCorrect);
  }

  function updateNumIncorrect(newIncorrect) {
    $('.incorrect').html(newIncorrect);
  }

  return {
    init: _init
  }
}());








