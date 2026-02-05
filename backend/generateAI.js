// ฟังก์ชัน mock AI แปลงคำสั่งเป็น API schema
async function generateAPISchema(userRequest) {
  // ตัวอย่างสร้าง API schema อัตโนมัติจากคำสั่ง
  return {
    endpoints: [
      {
        route: "/items",
        method: "GET",
        description: "ดึงรายการสินค้า",
        response: { items: [{ id: 1, name: "Item A" }] }
      },
      {
        route: "/orders",
        method: "POST",
        description: "สร้างคำสั่งซื้อ",
        request: { itemId: "number", quantity: "number" },
        response: { success: true, orderId: 123 }
      }
    ],
    uiPreview: {
      homepage: { title: "ร้านค้าออนไลน์", components: ["Header", "ProductList", "Cart"] }
    }
  };
}

module.exports = generateAPISchema;
