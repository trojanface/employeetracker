class Question {//contains the necessary variables for a question in inquirer
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
      this.validate = standardValidation;
    }
  }
  module.exports = Question;
  