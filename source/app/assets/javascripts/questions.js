$(function(){
  sessionKey = newSessionKey();
  bindEvents();
  loadQuestions();
});


function newSessionKey(){
  return Math.floor(Math.random()*10000000000);
}

function appendQuestionText(question){
  $('.container').append($('#question-template').clone());
  var newQuestionDiv = $('.container .question').last();
  newQuestionDiv.attr('id', '');
  newQuestionDiv.attr('data-question_id', question.question_id);
  newQuestionDiv.find('h3').text(question.question);
    for(var i=0; i<question.choices.length; i++){
      appendAnswerText(question.choices[i]);
    }
}


function appendAnswerText(choice){
  var newQuestionDiv = $('.container .question').last();
  var newAnswerDiv = $('#answer-template').clone();
  newAnswerDiv.text(choice.choice);
  newAnswerDiv.attr('id', '');
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
      appendQuestionText(data.question);
    }).fail(function(error){
      flag = false;
    });
  }
}

function bindEvents(){
  $('.container').on('click', '.answer' , checkAnswer);
  $('.submit').on('click', checkScores);
}

function checkAnswer(e) {
  e.preventDefault;
  var $currentAnswer = $(e.target)
  $currentAnswer.siblings('.answer').css('background-color', 'lightblue');
  $currentAnswer.css('background-color', 'steelblue');
  answerId = $currentAnswer.data('answer_id');
  questionId = $(e.target.parentElement).data('question_id');
  $.ajax({
    url: '/questions/' + questionId + '/answers.json',
    type: 'POST',
    data: {choice_id: answerId, session_key: sessionKey}
  }).done(function(data){
    Score.updateScore(data);
  });

}

var Score = {

  responses: {},

  result: function(){
    resultHash = {correct: 0, incorrect: 0};
    for(key in this.responses){
      this.responses[key] ? resultHash.correct++ : resultHash.incorrect++;
    }
    return resultHash;
  },

  updateScore: function(response){
    var questionId = response.status.question_id.toString();
    var questionResult = response.status.correct;
    this.responses[questionId] = questionResult;
  }
}

function checkScores(){
  var scores = Score.result()
  var resultString = "You got "+scores.correct+" questions right and fucked up "+scores.incorrect+ " times!"
  $('.response').text(resultString)
}