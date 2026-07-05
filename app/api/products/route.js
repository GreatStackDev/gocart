


export async function GET() {
    try {
        let products = await prisma.product.findMany({
            where: {
                inStock: true,
            },
            include: {
                rating: {
                    select: {
                        createdAt: true,
                        rating: true,
                        review: true,   
                        user: {
                            select: {
                                name: true,
                                image: true
                            }
                        },
                    }, 
                },
                store: true,
            },
            orderby: {
                createdAt: 'desc'
            }
        })
        
        //remove products with the store isActive false

        products = products.filter(product => product.store.isActive)
        
        return NextResponse.json({products}, {status: 200})

    } catch (error) {
        console.log(error)
        return NextResponse.json({error: 'Failed to fetch products'}, {status: 500}) 
    }
}