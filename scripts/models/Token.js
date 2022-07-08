class Token {
  name;
  email;
  password;
  loginSuccess;
  token;
  massage;

  //   constructor(name, email, password, loginSuccess, token, massage) {
  //     this.name = name;
  //     this.email = email;
  //     this.password = password;
  //     this.loginSuccess = loginSuccess;
  //     this.token = token;
  //     this.massage = massage;
  //   }

  GenerateNewToken(name, email, password, loginSuccess, token, massage) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.loginSuccess = loginSuccess;
    this.token = token;
    this.massage = massage;
  }

  SetToken(token, loginSuccess) {
    this.token = token;
    this.loginSuccess = loginSuccess;
  }
  SetMassage(massage) {
    this.massage = massage;
  }
}

module.exports = Token;
