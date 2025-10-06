'use client'
import React, { useState } from 'react'
import Title from './Title'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Mail } from 'lucide-react'
import toast from 'react-hot-toast'

const Newsletter = () => {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        toast.success('Successfully subscribed to newsletter!')
        setEmail('')
        setIsLoading(false)
    }

    return (
        <div className='flex flex-col items-center mx-4 my-36'>
            <Title title="Join Newsletter" description="Subscribe to get exclusive deals, new arrivals, and insider updates delivered straight to your inbox every week." visibleButton={false} />
            
            <form onSubmit={handleSubmit} className='w-full max-w-xl my-10'>
                <div className='flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300'>
                    <div className='flex-1'>
                        <Input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            leftIcon={<Mail size={18} />}
                            className="border-0 shadow-none bg-transparent focus-visible:ring-0 focus-visible:border-0 h-12"
                            required
                        />
                    </div>
                    <Button 
                        type="submit" 
                        variant="gradient" 
                        size="lg"
                        loading={isLoading}
                        className="rounded-xl px-8 whitespace-nowrap"
                    >
                        Get Updates
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default Newsletter