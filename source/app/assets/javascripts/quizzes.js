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
    $('.quiz-list').on('click', '.quiz-link', QuestionsController.getFirstQuestion)
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
  function getFirstQuestion(event) {
    event.preventDefault()
    $.ajax({
        type: 'get',
        url: $(this).attr('href') + '/questions/next.json',
        data: { session_key: sessionKey }
    })
    .done(function(data){
       renderQuestion(data.question)
    })
  }

  function getNextQuestion(event, url) {
     event.preventDefault()
    $.ajax({
        type: 'get',
        url: url,
        data: { session_key: sessionKey }
    })
    .done(function(data){
       renderQuestion(data.question)
    })
  }




  function displayResult(event) {
    event.preventDefault()

    $.ajax({
      type: 'post',
      url: $(event.target).attr('href'),
      data: { session_key: sessionKey, choice_id: $(this).attr('id')  }
    })
    .done(function(data){
      renderResults(data)
      var quiz_id = data.status.quiz_id
      var url = "quizzes/" + quiz_id + "/questions/next.json"
      if (data.status.correct == true && data.status.more_questions == true){
        getNextQuestion(event, url)
    } else if (data.status.correct == true && data.status.more_questions != true) {
        $(".container").html("GOOD JERB")
        sessionKey += "x"
    }
    })
  }



  function renderQuestion(question) {
    var $questionTemplate = $($('#question-template').html())
    var $questionField = $($questionTemplate[0])
    $questionField.html(question.question).data('id', question.question_id)
    for (var i in question.choices) {
      renderChoice($questionTemplate, question.choices[i])
    }
    $('.container').html($questionTemplate)
  }

  function renderChoice($questionTemplate, choice) {
    var $choiceTemplate = $($('#choice-template').html())
    var $choiceLink = $choiceTemplate.find('a')
    $choiceLink.html(choice.choice).attr('href', '/questions/' + choice.question_id + '/answers.json').attr('id', choice.choice_id).attr('question_id', choice.question_id).attr('quiz_id', choice.quiz_id)
    $questionTemplate.append($choiceTemplate)
  }

  function renderResults(data) {
    var $resultsTemplate = $($('#results-template').html())
    var $resultsField = ($($($resultsTemplate)[0]))
    $($resultsField).html(data.status.correct + "<br>" + data.status.num_correct + "/" + data.status.num_incorrect )
    $('.results').empty()
    $('.results').append($resultsTemplate)

  }

  return {
    getFirstQuestion: getFirstQuestion,
    displayResult: displayResult
  }
}())
