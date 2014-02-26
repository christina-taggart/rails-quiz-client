$( document ).ready(function() {
  $('#quiz-link a').on('ajax:success', Quiz.showQuizzes);
  $('#quiz-link a').on('ajax:error', Quiz.quizFail);
});

var Quiz = {
  showQuizzes: function(e, data) {
    e.preventDefault();
    $('#quiz-link').hide();
    for (var i = 0; i < data.quizzes.length; i++) {
      $('#show-quizzes').append("<a href='#'>" + data.quizzes[i].name + "</a>");
    }
    //shitWeWant = JSON.parse(data)
  },
  quizFail: function(e, xhr) {
    $('#show-quizzes').append(xhr.statusText);
  }
}