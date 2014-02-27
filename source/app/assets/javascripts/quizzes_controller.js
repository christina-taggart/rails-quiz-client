var QuizzesController = (function() {

  function hideButtonAndShowQuizzes(e) {
    e.preventDefault()
    // hide button
    $('#start-button').hide()
    // update browser location bar
    history.pushState({},"list of quizzes", "/quizzes")
    // make an AJAX call to the server to get the quiz list
    $.ajax({
      method: 'get',
      url: '/quizzes.json'
    }).done(function(response) {
      renderQuizList(response.quizzes)
    })

  }

  function renderQuizList(quizList) {
    var quizListTemplate = $($('#quiz-list-template').html())
    for (var i=0; i<quizList.length;i++) {
      renderQuiz(quizListTemplate, quizList[i])
    }
    $('.container').append(quizListTemplate)
  }

  function renderQuiz(quizListTemplate, quiz) {
    var quizTemplate = $($('#quiz-template').html())
    quizTemplate.find('a').text(quiz.name).attr('href', '/quizzes/'+quiz.quiz_id)
    quizListTemplate.append(quizTemplate)
  }


  return {
    hideButtonAndShowQuizzes: hideButtonAndShowQuizzes
  }

}())
