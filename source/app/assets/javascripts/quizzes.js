$( document ).ready(function() {
    showQuizzes()
    createSimpleSession()
    getQuestion()
});

var createSimpleSession = function() {
  return Math.floor(Math.random()*100000000)
};

var showQuizzes = function() {
  event.preventDefault();
    $.ajax({
      // type: 'GET',
      url: '/quizzes.json',
      // datatype: 'json',
      // data: { session_key: createSimpleSession() },
      success: displayQuizzes
  })
};

var displayQuizzes = function(response) {
  var $quizTemplate = $('#templates .quiz')

  for (i=0; i < response.quizzes.length; i++) {
    var $clonedTemplate = $quizTemplate.clone()
    $clonedTemplate.find('h1').html(response.quizzes[i].name)
    $clonedTemplate.find('button').data('id', response.quizzes[i].quiz_id)
    $clonedTemplate.find('button').data('sessionKey', sessionKey)
    $clonedTemplate.removeAttr('style')
    $('.quizzes-list').append($clonedTemplate)
  }
}

var getQuestion = function() {
  $('button').on('click', function() {
    $.ajax({
      method: this.method,
      url: '/quizzes/' + this.data('id') + '/questions/next.json',
      datatype: 'json'
    }).done(function() {debugger})
  })
}


//
//
//
//
// ... OR ...
//
// var $quizTemplate = $($('#quiz-template').html())
// $quizTemplate.find('h1').html("whatevs").data('id', data.quiz_id)


// var displayQuizzes = function(response) {
//   for (i=0; i < response.quizzes.length; i++) {
//     $('#quiz').append(response.quizzes[i].name + "<br>")
//   }
// }
