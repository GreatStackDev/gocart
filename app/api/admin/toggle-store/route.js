import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authAdmin from "@/middlewares/authAdmin";
import prisma from "@/lib/prisma";



//toggle store is active



export async function POST(request) {
    try {
        const {userId} = getAuth(request)
        const isAdmin = await authAdmin(userId)
        if (!isAdmin) {
            return NextResponse.json({
                error: "you are not authorized to toggle store"
            }, {status: 401})
        }

        const {storeId} = await request.json()
        if (!storeId) {
            return NextResponse.json({
                error: "missing details: storeId"
            }, {status: 400})
        }
//FIND THE STORE 
        const store = await prisma.store.findUnique({
            where: {
                id: storeId
            }
        })
        if (!store) {
            return NextResponse.json({
                error: "store not found"
            }, {status: 404})
        }

        await prisma.store.update({
            where: {
                id: storeId,
            },
            data: {
                isActive: !store.isActive,
            },
        })
 
        return NextResponse.json({
            message: `Store updated successfully`
        })
    } catch (error) {
        console.error(`[POST /api/admin/toggle-store] ${error.message}`, { userId })
        return NextResponse.json({
            error: error.code || error.message,
        }, { status: 400 })
    }
}