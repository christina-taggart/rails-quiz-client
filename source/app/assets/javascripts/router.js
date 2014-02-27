var Router = (function() {
  function init() {
    // start button
    $('#start-button').on('click', QuizzesController.hideButtonAndShowQuizzes)

    // click on a quiz

    // submit an answer

    // restart quiz
  }

  function route(path) {
    // THIS NEEDS WORK!
    console.log("Routing to", path)
    switch(path) {
      case "/quizzes":
        QuizzesController.showQuizzes(new Event("load"))
      default:
        break
    }
  }


  return {
    init: init,
    route: route
  }
}())
