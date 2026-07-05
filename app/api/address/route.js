import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


// get all addresses 
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
        return NextResponse.json({ message: 'Failed to fetch addresses' }, { status: 500 })
    }
}