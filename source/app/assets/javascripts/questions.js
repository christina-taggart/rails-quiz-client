$(function(){
  sessionKey = newSessionKey();
  Controller.initialize();
});

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


var Controller =(function(){
  var _fetchQuizzes = function(){
    $.get('/quizzes.json', function(data){
      QuizView.loadQuizzes(data.quizzes)
    })
  };

  var _fetchQuestions = function(quizId, data){
    var questionsRemaining = true;
    var url = '/quizzes/'+ quizId +'/questions/next.json'
    var lastQuestionNum = 0

    while (questionsRemaining){
      var sendData = {session_key: sessionKey, question_id: lastQuestionNum++}
      $.ajax({
        url: url,
        type: 'GET',
        data: sendData,
        async: false
      })
      .done(function(data){
        QuizView.loadQuestion(data.question);
      })
      .fail(function(error){
        questionsRemaining = false;
      })
    }
  };

  var _checkAnswer = function(answer){
    var answerId = $(answer).data('id')
    var questionId = $(answer.parentElement).data('question_id')
    var url = '/questions/' + questionId + '/answers.json'
    $.post(url, {choice_id: answerId, session_key: sessionKey}, function(data){
      Score.updateScore(data);
    })
  };

  var _bindEvents = function(){
    $('#start-quiz').on('click', QuizView.loadQuizStart);
    $('.quiz-container').on('click', '.answer', Controller.checkAnswer);
    $('#submit-quiz').on('click', Controller.postScores);
    $('.quiz-container').on('click', '.quiz', QuizView.highlightSelected)
  };


  return {

    initialize: function(){
      _fetchQuizzes();
      _bindEvents();
    },

    startQuiz: function(quizNum){
      _fetchQuestions(quizNum)
    },

    checkAnswer: function(){
      QuizView.highlightSelected(event);
      _checkAnswer(event.target)
    },

    postScores: function(){
      var numCorrect = Score.result().correct;
      var numIncorrect = Score.result().incorrect;
      QuizView.displayResults(numCorrect, numIncorrect)
    }
  }
})()

var QuizView = (function(){

  var _buildButtons = function(buttonText, buttonType, id, klass){
    var newButtonDiv = $('#button-template').clone()
    newButtonDiv[0].removeAttribute('id');
    newButtonDiv.text(buttonText).attr('data-id', id);
    newButtonDiv.addClass(buttonType);
    _appendButtons(klass, newButtonDiv);
  };

  var _appendButtons = function(klass, data){
    $(klass).last().append(data);
  }

  var _appendQuestion = function(question){
    var newQuestionDiv = $('#question-template').clone()
    newQuestionDiv[0].removeAttribute('id');
    newQuestionDiv.attr('data-question_id', question.question_id);
    newQuestionDiv.find('h3').text(question.question);
    $('.quiz-container').last().append(newQuestionDiv)
  }

  return {
    loadQuizzes: function(quizzes){
      for (var i=0; i<quizzes.length; i++){
        var quiz = quizzes[i];
        _buildButtons(quiz.name, 'quiz', quiz.quiz_id, '.quiz-container');
      }
      $('.quiz-container').append($('#start-quiz'));
    },

    loadQuizStart: function(){
      var quizNum = $('.selected').attr('data-id')
      $('.quiz-container').empty()
      Controller.startQuiz(quizNum);
    },

    loadQuestion: function(question){
      var answerChoices = question.choices
      _appendQuestion(question);
      for (var i=0; i<answerChoices.length; i++){
        var answer = answerChoices[i]
        _buildButtons(answer.choice, 'answer', answer.choice_id, '.container .question');
      }
      $('.quiz-container').append($('#submit-quiz'));
    },

    displayResults: function(numCorrect, numIncorrect){
      var resultString = "You got "+ numCorrect +"  right and fucked up "+numIncorrect+ " times!"
      $('.quiz-container').append($('.response').find('h2').text(resultString));
    },

    highlightSelected: function(event){
      $(event.target).addClass('selected');
      $(event.target).siblings().removeClass('selected');
    }
  }
})()


function newSessionKey(){
  return Math.floor(Math.random()*10000000000);
}