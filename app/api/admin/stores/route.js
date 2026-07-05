import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authAdmin from "@/middlewares/authAdmin";
import prisma from "@/lib/prisma";



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
                    in: ['approved']
                }
            },
            include: {
                user: true,
            },
        })
 
        return NextResponse.json({ stores })
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error: error.code || error.message,
            status: 400,
        })
    }
}