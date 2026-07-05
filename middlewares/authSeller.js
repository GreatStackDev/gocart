import prisma from "@/lib/prisma";


const authSeller = async (userId) =>{
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {store: true}
        })

        if (user.store) {
            if (user.store.status === 'approved') {
                return user.store.id
            } else {
                return false
            }
        }
    } catch (error) {
        console.error(error)
    return false
        
    }
  

    
}

export default authSeller