$(function(){
  sessionKey = newSessionKey();
  bindEvents();
  loadQuestions();
});

function newSessionKey(){
  return Math.floor(Math.random()*10000000000)
}

function appendQuestionText(question){
  $('.container').append($('#question-template').clone())
  var newQuestionDiv = $('.container .question').last()
  newQuestionDiv.attr('id', '')
  newQuestionDiv.attr('data-question_id', question.question_id)
  newQuestionDiv.find('h3').text(question.question)
    for(var i=0; i<question.choices.length; i++){
      appendAnswerText(question.choices[i]);
    }
}


function appendAnswerText(choice){
  var newQuestionDiv = $('.container .question').last();
  var newAnswerDiv = $('#answer-template').clone();
  newAnswerDiv.find('a').text(choice.choice);
  newAnswerDiv.attr('id', '')
  newAnswerDiv.attr('data-answer_id', choice.choice_id);
  newQuestionDiv.append(newAnswerDiv);
}

function loadQuestions(){
  var flag = true;
  var i = 0
  while(flag){
    $.ajax({
      url: '/quizzes/1/questions/next.json',
      type: 'GET',
      data: {session_key: sessionKey, question_id: i++},
      async: false
    }).done(function(data){
      console.log(data)
      appendQuestionText(data.question);
    }).fail(function(error){
      flag = false;
    });
  }
}

function bindEvents(){
  $('.container').on('click', '.answer' , checkAnswer);
}

function checkAnswer(e) {
  e.preventDefault;
  answerId = $(e.target.parentElement).data('answer_id');
  questionId = $(e.target.parentElement.parentElement).data('question_id');
  $.ajax({
    url: '/questions/' + questionId + '/answers.json',
    type: 'POST',
    data: {choice_id: answerId, session_key: sessionKey}
  }).done(function(data){
    $('.response').html(data.status.correct.toString());
  });

}
