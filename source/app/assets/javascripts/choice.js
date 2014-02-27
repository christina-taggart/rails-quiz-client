//-----CHOICE MODULE-----
var Choice = {
  renderAll: function(choices) {
    choicesHtml = "";
    for (var i=0; i < choices.length; i++) {
      choice = choices[i];
      choicesHtml += "<input type='radio' name='choice_id' value='" +choice.choice_id + "'>" + choice.choice
    }
    return choicesHtml
  }
}