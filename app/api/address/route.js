import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


// add new address 
export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const { address } = await request.json()

        address.userId = userId
        
        const newAddress = await prisma.address.create({
            data: address
        })

        return NextResponse.json({ message: 'Address created successfully' }, { status: 200 })
        
    } catch (error) {
        console.log(error);
        return NextResponse.json(
          { error: error.code || error.message, status: 400 },
          { status: 400 },
        );
    }
}

// get all addresses

export async function GET(request) {
    try {
        const {userId} = getAuth(request)
        const addresses = await prisma.address.findMany({
            where: {
                userId: userId
            },
            
        })
        return NextResponse.json({ addresses })
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error: error.code || error.message,
            status: 400,
        })
    }
}
