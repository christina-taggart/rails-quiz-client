var getId = function(quizLink) {
  return parseInt(quizLink.attr('data-id'));
}




//-----ON DOCUMENT READY-----
$( document ).ready(function() {
  sessionKey = KeyGenerator.randomKey();
  Quiz.getQuizzes();

  $('.container').on('click', '.quiz a', function() {
    event.preventDefault();
    Question.getNextQuestion(getId($(this)));
  });
})