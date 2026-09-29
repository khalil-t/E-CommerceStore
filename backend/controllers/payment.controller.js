import mongoose from "mongoose";
import Product from "../model/product.model.js";
import Coupon from "../model/coupon.model.js";
import Order from "../model/order.model.js";
import { verifyPayment } from "../lib/payments.js";


const GIFT_COUPON_MIN_ORDER_AMOUNT = 200;

class CheckoutError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}


const priceCart = async (products) => {
    if (!Array.isArray(products) || products.length === 0) {
        throw new CheckoutError(400, "Invalid or empty products array");
    }

    const productIds = products.map((item) => item.product);

    if (productIds.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
        throw new CheckoutError(400, "Invalid product id");
    }

    const uniqueProductIds = [...new Set(productIds.map((id) => id.toString()))];

    const dbProducts = await Product.find({ _id: { $in: uniqueProductIds } });

    if (dbProducts.length !== uniqueProductIds.length) {
        throw new CheckoutError(404, "One or more products were not found");
    }

    let totalAmount = 0;
    const orderProducts = [];

    for (const item of products) {
        const quantity = Number(item.quantity);

        if (!Number.isInteger(quantity) || quantity < 1) {
            throw new CheckoutError(400, "Invalid quantity");
        }

        const dbProduct = dbProducts.find(
            (p) => p._id.toString() === item.product.toString()
        );

        totalAmount += dbProduct.price * quantity;

        orderProducts.push({
            product: dbProduct._id,
            quantity: quantity,
            price: dbProduct.price,
        })
    }

    return { orderProducts, totalAmount };
}


const lineItemKey = (items) =>
    items
        .map((item) => `${item.product.toString()}:${item.quantity}:${item.price}`)
        .sort()
        .join("|");


export const quoteCheckout = async (req, res) => {
    try {
        const { products } = req.body;
        const { orderProducts, totalAmount } = await priceCart(products);

        res.status(200).json({
            success: true,
            items: orderProducts,
            finalPrice: totalAmount,
        });
    } catch (error) {
        if (error instanceof CheckoutError) {
            return res.status(error.status).json({ error: error.message });
        }
        console.log("error", error.message)
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const createCheckoutSession = async (req, res) => {
    try {
        const { products } = req.body;
        const { orderProducts, totalAmount } = await priceCart(products);


        const existingOrder = await Order.findOne({
            user: req.user._id,
            status: "pending",
        });

        if (existingOrder) {
            if (
                existingOrder.totalAmount === totalAmount &&
                lineItemKey(existingOrder.products) === lineItemKey(orderProducts)
            ) {
                return res.status(200).json({
                    success: true,
                    message: "Checkout already in progress.",
                    orderId: existingOrder._id,
                    finalPrice: existingOrder.totalAmount,
                });
            }

            existingOrder.products = orderProducts;
            existingOrder.totalAmount = totalAmount;
            await existingOrder.save();

            return res.status(200).json({
                success: true,
                message: "Order updated successfully.",
                orderId: existingOrder._id,
                finalPrice: totalAmount,
            });
        }

        const newOrder = new Order({
            user: req.user._id,
            products: orderProducts,
            totalAmount: totalAmount,
            status: "pending",
        })

        try {
            await newOrder.save();
        } catch (error) {
   
            if (error.code === 11000) {
                const winner = await Order.findOne({
                    user: req.user._id,
                    status: "pending",
                });

                if (winner) {
                    return res.status(200).json({
                        success: true,
                        message: "Checkout already in progress.",
                        orderId: winner._id,
                        finalPrice: winner.totalAmount,
                    });
                }
            }

            throw error;
        }

        res.status(200).json({
            success: true,
            message: "Order created successfully.",
            orderId: newOrder._id,
            finalPrice: totalAmount,
        });

    } catch (error) {
        if (error instanceof CheckoutError) {
            return res.status(error.status).json({ error: error.message });
        }
        console.log("error", error.message)
        res.status(500).json({ message: "Server error", error: error.message });
    }
}








async function createNewCoupon(userId) {
    await Coupon.findOneAndDelete({userId})
const newCoupon= new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userId: userId,
})
await newCoupon.save()
return newCoupon

}

export const checkoutSuccess= async(req, res)=>{
    const { orderId, paymentReference } = req.body;
try{
if(!mongoose.Types.ObjectId.isValid(orderId)){
    return res.status(400).json({ error: "Invalid order id" });
}

const order = await Order.findOne({
    _id: orderId, 
    user: req.user._id,
    status : "pending"
})
if (!order) {
    return res.status(404).json({ error: "Pending order not found" });
  }

  let payment;
  try {
    payment = await verifyPayment({ order, paymentReference });
  } catch (error) {
    return res.status(402).json({ error: error.message });
  }


  const coupon = await Coupon.findOne({
    userId: order.user,
    isActive: true,
  })
if(coupon){
    coupon.isActive=false
await coupon.save()
}
order.status= "paid"
order.paymentReference = payment.reference
await order.save()


if(order.totalAmount >= GIFT_COUPON_MIN_ORDER_AMOUNT){
    await createNewCoupon(order.user)
}


res.status(200).json({
    success: true,
    message: "Order completed successfully.",
    orderId: order._id,
    finalPrice: order.totalAmount,
  });
}
catch(error){
    console.log("error" , error.message)
     res.status(500).json({ message: "Server error", error: error.message });
    }

}

