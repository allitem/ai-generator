const Prosc = require("./prosc");
const generateAPISchema = require("./generateAI");

class AutoGenerator {
  constructor(total = 1000) {
    this.total = total;
    this.generatedAPIs = [];
  }

  async run() {
    for (let i = 1; i <= this.total; i++) {
      // ตัวอย่าง: ใช้ prompt อัตโนมัติ
      const userRequest = `สร้างโมดูล API อัตโนมัติหมายเลข ${i}`;
      
      // AI generate API schema
      const apiSchema = await generateAPISchema(userRequest);
      
      // ส่ง SC ตรวจสอบ
      const validation = await Prosc.validateAPI(apiSchema);
      
      if (validation.valid) {
        await Prosc.sendToSC(apiSchema);
        console.log(`✅ API #${i} สร้างและส่ง SC เรียบร้อย`);
      } else {
        console.log(`⚠️ API #${i} ไม่ผ่าน validation`);
      }

      this.generatedAPIs.push({ id: i, apiSchema, validation });
    }

    return this.generatedAPIs;
  }
}

module.exports = AutoGenerator;
