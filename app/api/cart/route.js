// update user cart

import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const { cart } = await request.json()
        
        // save the cart to the db
        
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                cart: cart
            }
        })

        return NextResponse.json({ message: 'Cart updated successfully' }, { status: 200 })
        


        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Failed to update cart' }, { status: 500 })
    }
}

//get user cart 
export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        return NextResponse.json({ cart: user.cart }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Failed to fetch cart' }, { status: 500 })
    }
}
    
    