$(document).ready(function() {
  retrieveQuizzes.init();
});

 var retrieveQuizzes = {
  init: function() {
    $('.get_quizzes').on("ajax:success", this.appendQuiz);
  },

  appendQuiz: function(e, data, status, xhr) {
    for (var i = 0; i < data.quizzes.length; i++) {
      quizName = data.quizzes[i].name
      quizID = data.quizzes[i].quiz_id
      $('.append_quiz').append('<li class="get_questions"> <a href="/quizzes/' + quizID + '/questions/next.json" data-remote="true">' + quizName + '</a></li>')
    }
  }
 }

 var retrieveQuestions = {
  init: function() {
    $('.append_quiz').on('ajax:success', '.get_questions', this.appendQuestions);
  },

  appendQuestions: function(e, data, status, xhr) {
    console.log(data)
  }
 }



// var Menu = {
//   init: function() {
//     $('.get_quizzes').on('click', this.showQuiz);
//   },

//   show: function(e) {
//     e.preventDefault();
//     $('form#new_menu').toggleClass('hidden');
//   }
// }

// $(document).ready(function() {
//   Menu.init();
// })