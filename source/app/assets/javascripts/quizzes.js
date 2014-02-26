// we learned:
//   - script type text/template
//   - home-grown MVC pattern in JS
//   - practiced module pattern
//   - practiced AJAX
//   - practiced .data() attributes

// think about:
//   - should the location bar change depending on where the user is? (investigate push state / location.hash)
//   - should the rendering functions be in the controller, or in some "Views" module?


var sessionKey = (new Date()).getTime().toString()


$(function() {
  Router.init()
  QuizzesController.getQuizzes()
})



var Router = (function() {
  function init() {
    // bind our events here  
    $('.quiz-list').on('click', '.quiz-link', QuestionsController.getNextQuestion)
    $('.container').on('click', '.choice-link', QuestionsController.displayResult)
  }
  
  return {
    init: init
  }
}())

var QuizzesController = (function() {
  function getQuizzes() {
    $.ajax({
      type: 'get',
      url: '/quizzes.json'
    }).done(function(data) {
      for (var i=0; i < data.quizzes.length; i++) {
        render(data.quizzes[i])
      }
    }).fail(function() {
      alert("Uh-oh!")
    })
  }
  
  function render(quiz) {
    var $quizTemplate = $($('#quiz-template').html())
    var $quizAnchor = $quizTemplate.find('a')
    $quizAnchor.html(quiz.name).attr('href', '/quizzes/'+quiz.quiz_id).data('id', quiz.quiz_id)
    $('.quiz-list').append($quizTemplate)
  }
  
  return {
    getQuizzes: getQuizzes
  }
}())

var QuestionsController = (function() {
  function getNextQuestion(event) {
    event.preventDefault()
    $.ajax({
        type: 'get',
        url: $(event.target).attr('href') + '/questions/next.json',
        data: { session_key: sessionKey }
    })
    .done(function(data){
       renderQuestion(data.question)
    })
  }

  
  
  function renderQuestion(question) {
    // for each choice, renderChoice()
    // var $quizTemplate = $($('#quiz-template').html())
    // var $quizAnchor = $quizTemplate.find('a')
    // $quizAnchor.html(quiz.name).attr('href', '/quizzes/'+quiz.quiz_id).data('id', quiz.quiz_id)
    // $('.quiz-list').append($quizTemplate)
    var $questionTemplate = $($('#question-template').html())
    var $questionField = $questionTemplate.find('p')
    $questionField.html(question.question).data('id', question.question_id)
    for (var i in question.choices) {
      renderChoice($questionTemplate, question.choices[i])
    }
    $('.container').html($questionTemplate)
  }
  
  function renderChoice($questionTemplate, choice) {
    var $choiceTemplate = $($('#choice-template').html())
    var $choiceLink = $choiceTemplate.find('a')
    $choiceLink.html(choice.choice).attr('href', '/questions/' + choice.question_id + '/answers.json').data('id', choice.choice_id).data('question_id', choice.question_id).data('quiz_id', choice.quiz_id)
    $questionTemplate.append($choiceTemplate)
  }

  return {
    getNextQuestion: getNextQuestion
  }
}())
