
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authAdmin from "@/middlewares/authAdmin";
import prisma from "@/lib/prisma";


//approve seller



export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const isAdmin = await authAdmin(userId)
        if (!isAdmin) {
            return NextResponse.json({
                error: "you are not authorized to approve store"
            }, {status: 401})
        }

        const { storeId, status } = await request.json()

        if (status === 'approved') {
            await prisma.$transaction([
                prisma.store.update({
                    where: { id: storeId },
                    data: { status: 'approved', isActive: true },
                }),
                prisma.verificationRequest.update({
                    where: { storeId: storeId },
                    data: { status: 'approved', reviewedAt: new Date() },
                })
            ]);
        } else if (status === 'rejected') {
            await prisma.$transaction([
                prisma.store.update({
                    where: { id: storeId },
                    data: { status: 'rejected', isActive: false },
                }),
                prisma.verificationRequest.update({
                    where: { storeId: storeId },
                    data: { status: 'rejected', reviewedAt: new Date() },
                })
            ]);
        }

        return NextResponse.json({
            message: `Store ${status} successfully`
        })
        
    } catch (error) {
        console.error(`[POST /api/admin/approve-store] ${error.message}`, { userId })
        return NextResponse.json({
            error: error.code || error.message,
        }, { status: 400 })
    }
}   


// get all pending and rejected stores


export async function GET(request) {
    try {
        const {userId} = getAuth(request)
        const isAdmin = await authAdmin(userId)
        if (!isAdmin) {
            return NextResponse.json({
                error: "you are not authorized to get stores"
            }, {status: 401})
        }

        const stores = await prisma.store.findMany({
            where: {
                status: {
                    in: ['pending', 'rejected']
                }
            },
            include: {
                user: true,
            },
        })
 
        return NextResponse.json({ stores })
    } catch (error) {
        console.error(`[GET /api/admin/approve-store] ${error.message}`)
        return NextResponse.json({
            error: error.code || error.message,
        }, { status: 400 })
    }
}