class HomeController < ApplicationController
  def index
    @quiz = Quiz.first
  end
end