class Token {
  name;
  aid;
  email;
  password;
  loginSuccess;
  token;
  massage;
  data;

  GenerateNewToken(name, email, password, loginSuccess, token, massage, data) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.loginSuccess = loginSuccess;
    this.token = "";
    this.massage = massage;
    this.data = data;
  }

  SetToken(token, loginSuccess) {
    this.token = token;
    this.loginSuccess = loginSuccess;
  }
  SetAid(aid) {
    this.aid = aid;
  }
  SetMassage(massage) {
    this.massage = massage;
  }
  SetData(data) {
    this.data = data;
  }
}

module.exports = Token;
