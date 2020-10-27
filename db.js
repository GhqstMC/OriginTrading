const Database = require("@replit/database");
const db = new Database();

module.exports = {
  set(key, value) {
    db.set(key, value);
  },
  get(key) {
    return db.get(key);
  },
  delete(key) {
    db.delete(key);
  },
  list() {
    return db.list();
  }
}