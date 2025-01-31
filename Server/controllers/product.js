const { query } = require("express");
const prisma = require("../Config/prisma");
const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINART_CLOUD_NAME,
  api_key: process.env.CLOUDINART_API_KEY,
  api_secret: process.env.CLOUDINART_API_SECRET,
});

exports.create = async (req, res) => {
  try {
    // code
    const {
      title,
      description,
      price,
      quantity,
      categoryId,
      images = [],
    } = req.body;

    // console.log(title, description, price, quantity, images)
    const product = await prisma.product.create({
      data: {
        title: title,
        description: description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId: parseInt(categoryId),
        images: {
          create: (images || []).map((item) => ({
            asset_id: item.asset_id || "", // ให้เป็น string เปล่าถ้า undefined
            public_id: item.public_id || "",
            url: item.url || "",
            secure_url: item.secure_url || "",
          })),
        },
      },
    });

    res.send(product);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message, // ส่งข้อความข้อผิดพลาดกลับไปให้ผู้ใช้งาน (สำหรับดีบัก)
    });
  }
};

exports.list = async (req, res) => {
  try {
    // code
    const { count } = req.params;
    const products = await prisma.product.findMany({
      take: parseInt(count),
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.read = async (req, res) => {
  try {
    // code
    const { id } = req.params;
    const products = await prisma.product.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.update = async (req, res) => {
  try {
    //code
    const { title, description, price, quantity, categoryId, images } =
      req.body;
    // console.log(title, description, price, quantity, images)

    // clear image
    await prisma.image.deleteMany({
      where: {
        productId: Number(req.params.id),
      },
    });

    const product = await prisma.product.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        title: title,
        description: description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId: parseInt(categoryId),
        images: {
          create: (images || []).map((item) => ({
            asset_id: item.asset_id || "", // ให้เป็น string เปล่าถ้า undefined
            public_id: item.public_id || "",
            url: item.url || "",
            secure_url: item.secure_url || "",
          })),
        },
      },
    });
    res.send(product);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message, // ส่งข้อความข้อผิดพลาดกลับไปให้ผู้ใช้งาน (สำหรับดีบัก)
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting product with ID:", id);

    if (isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Step 1: ค้นหาสินค้า
    const product = await prisma.product.findFirst({
      where: { id: Number(id) },
      include: { images: true },
    });

    if (!product) {
      console.log("Product not found");
      return res.status(400).json({ message: "Product not found!!!" });
    }
    console.log("Product found:", product);

    // Step 2: ลบรูปภาพจาก Cloudinary
    const deletedImage = product.images.map(
      (image) =>
        new Promise((resolve, reject) => {
          console.log("Deleting image with public_id:", image.public_id);
          cloudinary.uploader.destroy(image.public_id, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
        })
    );
    await Promise.all(deletedImage);
    console.log("All images deleted from Cloudinary");

    // Step 3: ลบสินค้า
    await prisma.product.delete({
      where: { id: Number(id) },
    });
    console.log("Product deleted from database");

    res.send("Delete Success");
  } catch (err) {
    console.error("Error while deleting product:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.listby = async (req, res) => {
  try {
    //code
    const { sort, order, limit } = req.body;
    console.log(sort, order, limit);
    const products = await prisma.product.findMany({
      take: limit,
      orderBy: {
        [sort]: order,
      },
      include: {
        category: true,
        images: true,
      },
    });

    res.send(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const handleQuery = async (req, res, query) => {
  try {
    //code
    const products = await prisma.product.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (err) {
    //err
    console.log(err);
    res.status(500).json({ message: "Search Error" });
  }
};
const handlePrice = async (req, res, priceRange) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        price: {
          gte: priceRange[0],
          lte: priceRange[1],
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error " });
  }
};
const handleCategory = async (req, res, categoryId) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId: {
          in: categoryId.map((id) => Number(id)),
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error " });
  }
};

exports.searchFilters = async (req, res) => {
  try {
    const { query, category, price } = req.body; // รับข้อมูลจาก req.body สำหรับ POST request

    let whereConditions = {};

    // ค้นหาตาม query
    if (query) {
      console.log("query-->", query);
      whereConditions.title = {
        contains: query,
      };
    }

    // ค้นหาตาม category
    if (category && category.length > 0) {
      console.log("category-->", category);
      whereConditions.categoryId = {
        in: category.map((id) => Number(id)), // แปลงค่า id ของหมวดหมู่เป็นตัวเลข
      };
    }

    // ค้นหาตาม price
    if (price && price.length === 2) {
      console.log("price-->", price);
      whereConditions.price = {
        gte: price[0], // ราคาต่ำสุด
        lte: price[1], // ราคาสูงสุด
      };
    }

    // ค้นหาสินค้าตามฟิลเตอร์ที่รวมกัน
    const products = await prisma.product.findMany({
      where: whereConditions, // ใช้เงื่อนไขที่รวมกันทั้งหมด
      include: {
        category: true,
        images: true,
      },
    });

    // ส่งผลลัพธ์กลับไป
    res.send(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createImages = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.image, {
      public_id: `${Date.now()}`,
      resource_type: "auto",
      folder: "Project Sabnua",
    });
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error " });
  }
};

exports.removeImage = async (req, res) => {
  try {
    const { public_id } = req.body; // รับค่าจาก body
    if (!public_id) {
      return res.status(400).json({ message: "Public ID is required" });
    }

    // ลบรูปภาพจาก Cloudinary หรือระบบจัดเก็บอื่น ๆ
    const result = await cloudinary.uploader.destroy(public_id);

    res.json({ success: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting image" });
  }
};
