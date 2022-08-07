class global {
  url = "";
  port = 0;
  base = "";
  link_con = "";

  async GenerateNewGlobal(url, port, base) {
    this.url = url;
    this.port = port;
    this.base = base;
    this.link_con = `${url}/${port}/${base}`;
  }

  getGlobal() {
    return this.link_con;
  }
}

module.exports = global;
