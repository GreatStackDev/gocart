import React from 'react'
import Title from './Title'
import { ourSpecsData } from '@/assets/assets'

/**
 * tradrsAvenue — Our Specifications / Value Props section
 * Flat card design, accent color from data, no gradients.
 */
const OurSpecs = () => {
    return (
        <div className="px-6 my-16 max-w-7xl mx-auto">
            <Title
                visibleButton={false}
                title="Built around you."
                description="Buying and selling made simple, secure, and local — for South Africans, by South Africans."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
                {ourSpecsData.map((spec, index) => (
                    <div
                        key={index}
                        className="relative flex flex-col items-center text-center px-6 pt-10 pb-8
                                   bg-white rounded-[12px] border border-[#E5E7EB]
                                   shadow-[0_1px_3px_rgba(0,0,0,0.08)]
                                   transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]"
                    >
                        {/* Icon block — floating above */}
                        <div
                            className="absolute -top-5 flex items-center justify-center w-10 h-10 rounded-[10px] text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
                            style={{ backgroundColor: spec.accent || '#1E1B4B' }}
                        >
                            <spec.icon size={18} />
                        </div>

                        <h3 className="font-[family-name:var(--font-heading)] font-semibold text-[#111827] mt-2">
                            {spec.title}
                        </h3>
                        <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">
                            {spec.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default OurSpecs