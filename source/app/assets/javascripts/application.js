//= require jquery
session_key = ""

$(document).ready(function(){
  App.bindEvents();
});

var App = {
  bindEvents: function() {
    $('.quiz-list').on('click', '.quiz-button', function(e){
      e.preventDefault();
      $('.quiz-list').css('display', 'none');
      Quiz.displayQuizName($(this).text());
      Quiz.getNextQuestion($(this).attr('data-quiz-id'));
      Quiz.checkAnswer();
    })
  }
}
var Quiz = {
  generateSessionKey: function() {
    var key = "";
    var selection = "0123456789abcdefghijklmnopqrstuvwxyz";

    for( var i=0; i < 16; i++ ){
        key += selection.charAt(Math.floor(Math.random() * selection.length));
    }
    session_key = key
    return key;
  },

  displayQuizName: function(quizName) {
    $('.quiz-name').text(quizName);
  },

  getNextQuestion: function(quizID) {
    self = this;
    $.ajax({
      url: "/quizzes/" + quizID + "/questions/next.json",
      data: {session_key: this.generateSessionKey}
    }).done(function(questionData) {
      self.displayQuestion(questionData);
    })
  },

  displayQuestion: function(questionData) {
    $('.question-and-choices').css('display', '');
    $('#question-content').text(questionData.question.question);
    $.each(questionData.question.choices, function(idx, val) {
      $('.choices').append("<button class='choice-button' data-question-id=" + questionData.question.question_id +
    " data-choice-id=" + val.choice_id + " data-session-key=" + session_key + ">" + val.choice + "</button>");
    })
  },

  displayGuessResult: function(guess){
    if (guess){
      alert('you guessed right!');
      $('.result-image').attr('src', 'http://img2.wikia.nocookie.net/__cb20131231191109/camphalfbloodroleplay/images/f/fb/Cat-gif-cats-15443736-250-188.gif');
      $('div.guess-result').css('display', 'block');
    } else {
      alert('you got that question wrong!');
      $('.result-image').attr('src', 'http://i307.photobucket.com/albums/nn284/hilariousgifs/sleeping-dog-running.gif');
      $('div.guess-result').css('display', 'block');
    }
    $('.next-question-button').css('display', 'inline-block');
    $('.next-question-button').on('click', function(){

    })
  },

  checkAnswer: function() {
    $('.choices').on('click', '.choice-button', function(){
      $.ajax({
        type: "post",
        url: "/questions/" + $(this).attr("data-question-id") + "/answers.json",
        data: { choice_id: $(this).attr("data-choice-id"), session_key: $(this).attr("data-session-key") }
      })
      .done(function(data){
        Quiz.displayGuessResult(data.status.correct);
      }).fail(function(xhr) {
        alert('failed');
      })
    })
  }

}
