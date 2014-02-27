//-----ANSWER MODULE-----
var Answer = (function() {
  var _renderResults = function(status) {
    if (status.correct === true) {
      message = "Your answer was correct!"
    } else {
      message = "Your answer was incorrect."
    }
    return message + "<button class='next-question'>Next Question</button>"
  }

  var _showResults = function(json) {
    stat = json.status
    $("#quiz" + stat.quiz_id + " .result").html(_renderResults(stat))
  }

  var _appendError = function() {
    $(".errors").html("Could not process the answer.")
    setInterval(function() { $(".errors").empty() }, 3000)
  }

  return {
    submitAnswer: function(form) {
      $.ajax({
        type: form.method,
        url: form.action,
        data: $(form).serialize() + sessionKey
      })
      .done(_showResults)
      .fail(_appendError)
    }
  }
})()