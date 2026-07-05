import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import authAdmin from "@/middlewares/authAdmin"
import prisma from "@/lib/prisma"



// add new coupon


export async function POST(request){
    try {
        const {userId} = getAuth(request)
        const isAdmin = await authAdmin(userId)
        if (!isAdmin) {
            return NextResponse.json({
                error: "you are not authorized to create coupon"
            }, {status: 401})
        }

        const { coupon } = await request.json()
        coupon.code = coupon.code.toUpperCase()
        
        await prisma.coupon.create({
            data: coupon,
        })

        return NextResponse.json({
            message: "Coupon created successfully",
        })
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error: error.code || error.message,
            status: 400,
        })
    }
}

// delete coupon

export async function DELETE(request) {
    try {
        const {userId} = getAuth(request)
        const isAdmin = await authAdmin(userId)
        if (!isAdmin) {
            return NextResponse.json({
                error: "you are not authorized to delete coupon"
            }, {status: 401})
        }

        const { searchParams } = request.nextUrl;
        const code = searchParams.get("code");

        await prisma.coupon.delete({
            where: {
                code,
            },
        })

        return NextResponse.json({
            message: "Coupon deleted successfully",
        })
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error: error.code || error.message,
            status: 400,
        })
    }
}


// get all coupons

export async function GET(request) {
    try {
        const {userId} = getAuth(request)
        const isAdmin = await authAdmin(userId)
        if (!isAdmin) {
            return NextResponse.json({
                error: "you are not authorized to get coupons"
            }, {status: 401})
        }

            const coupons = await prisma.coupon.findMany({})
        return NextResponse.json({coupons})
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error: error.code || error.message,
            status: 400,
        })
    }
}