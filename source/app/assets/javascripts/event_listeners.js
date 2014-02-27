var getId = function(quizLink) {
  return parseInt(quizLink.attr('data-id'));
}

//-----ON DOCUMENT READY-----
$( document ).ready(function() {
  // Sets the session key and loads all Quizzes via an AJAX request
  sessionKey = KeyGenerator.randomKey();
  Quiz.getQuizzes();

  // Clicking the quiz titles loads the quiz question dynamically
  $('.container').on('click', '.quiz a', function() {
    event.preventDefault();
    Question.getNextQuestion(getId($(this)));
  });

  //Submitting an answer for a question gives results dynamically
  $('.container').on('submit', '.quiz form', function() {
    event.preventDefault();
    form = $(this)[0]
    Answer.submitAnswer(form);
  })
})