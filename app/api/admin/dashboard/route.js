

import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import authAdmin from "@/middlewares/authAdmin"
import prisma from "@/lib/prisma"


export async function GET(request) {

    try {
        
    const {userId} = getAuth(request)
    const isAdmin = await authAdmin(userId)
    if (!isAdmin) {
        return NextResponse.json({
            error: "you are not authorized to get dashboard data"
        }, {status: 401})
    }

    const orders = await prisma.order.count()

    //get total stores on app
    const stores = await prisma.store.count()
        //get all orders include only create and total and calculate the revenue
 
        const allOrders = await prisma.order.findMany({
            select: {
                createdAt: true,
                total: true
            }
        })


    let totalRevnue = 0
    allOrders.forEach(order => {
        totalRevnue += order.total
    })

    const revenue = totalRevnue.toFixed(2)

    //total prouct on app 
    const products = await prisma.product.count()
    const dashboardData = {
        orders,
        stores,
        products,
        revenue, 
        allOrders
    }

    return NextResponse.json({dashboardData})
    } catch (error) {
        console.error(error)
        return NextResponse.json({
           error: error.code || error.message 
        }, {status: 400})
    }    

}