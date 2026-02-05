class Prosc {
  async validateAPI(apiSchema) {
    return { valid: true, message: "SC validation passed" };
  }

  async sendToSC(apiSchema) {
    console.log("✅ ส่ง API Schema ไป SC:", apiSchema);
    return { success: true };
  }
}

module.exports = new Prosc();
