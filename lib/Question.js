class Question {
    constructor(type, name, message, choices) {
      this.type = type;
      this.name = name;
      this.message = message;
      this.choices = choices;
      let standardValidation = (input) => {
        if (input === "") {
          return "Must be answered";
        }
        return true;
      };
    }
  }
  module.exports = Question;
  