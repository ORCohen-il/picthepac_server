class Delivery {
  data;
  success;
  massage;

  GenerateNewDelivery(data, success, massage) {
    this.data = data;
    this.success = success;
    this.massage = massage;
  }

  SetData(data) {
    this.data = data;
  }
  SetSuccess(success) {
    this.success = success;
  }
  SetMassage(massage) {
    this.massage = massage;
  }
}

module.exports = Delivery;
