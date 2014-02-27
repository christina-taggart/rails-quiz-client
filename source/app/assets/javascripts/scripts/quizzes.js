$( document ).ready(function() {
  $('#quiz-link a').on('ajax:success', Quiz.showQuizzes);
  $('#quiz-link a').on('ajax:error', Quiz.quizFail);
  $('#show-quizzes').on('click', 'a', Question.ajax);
});

var Quiz = {
  showQuizzes: function(e, data) {
    e.preventDefault();
    $('#quiz-link').hide();
    $('#show-quizzes').append("<h2>Choose a Quiz!</h2>");
    for (var i = 0; i < data.quizzes.length; i++) {
      var quiz_id = i+1;
      $('#show-quizzes').append("<a href='#' data-quiz-id=" + quiz_id + ">" + data.quizzes[i].name + "</a>");
    }
  },
  quizFail: function(e, xhr) {
    $('#show-quizzes').append(xhr.statusText);
  }
}

var Question = {
  ajax: function() {
      $.ajax({
      type: this.method,
      url: '/quizzes/' + $(this).attr("data-quiz-id") + '/questions/next.json',
      data: { session_key: 'a124f87dec55da23' },
      dataType: 'json'
    })
      .done(function(data) {
        $('#show-quizzes').hide();
        clone = $('#templates #question').clone();
        $('#show-questions').append(clone);
        $('#show-questions p').html(data.question.question);
      });
    },

  showQuestions: function(e, data) {
    debugger
    $('#show-quizzes').hide();
    for (var i = 0; i < data.questions.length; i++){
      var question_id = i+1;
      $('#show-questions').append(data.questions[i]);
    }
  },
  questionFail: function(e, xhr){
    $('#show-questions').append(xhr.statusText);
  }
}

//      /quizzes/:quiz_id/questions/next.json