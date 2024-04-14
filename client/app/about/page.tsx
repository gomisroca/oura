import Image from 'next/image';
import VerticalBannerPlaceholder from 'public/images/ph_hbanner.png';

interface Value {
    icon: string;
    title: string;
    body: string;
}

interface Partner {
    name: string;
    image?: string;
}

async function getData() {
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/about`)
        if(!res.ok){
            return null
        }

        return res.json();
    } catch(err){
        console.log(err)
    }
}

async function About() {
    const values: Value[] = [
        {
            icon: '🌲',
            title: 'Sustainability First',
            body: 'At the core of our sports clothing brand lies a commitment to sustainability. We believe in crafting apparel that not only enhances athletic performance but also minimizes environmental impact. From sourcing eco-friendly materials to reducing waste in production, sustainability guides every decision we make.'
        },
        {
            icon: '💥',
            title: 'Durability Guaranteed',
            body: 'We understand the demands athletes face, which is why durability is non-negotiable for us. Our products are built to withstand the rigors of training, competition, and everything in between. With reinforced stitching and high-quality materials, our apparel is designed to go the distance, ensuring athletes can focus on their performance without worrying about their gear.'
        },
        {
            icon: '🌟',
            title: 'Quality Craftsmanship',
            body: 'Quality is the cornerstone of our brand. We take pride in the meticulous craftsmanship that goes into every garment we produce. From the initial design concept to the final stitch, we prioritize attention to detail to deliver products that meet the highest standards of excellence. Athletes can trust that our apparel is not only sustainable and durable but also of superior quality.'
        },
        {
            icon: '🧪',
            title: 'Innovative Design',
            body: 'Innovation is key to staying ahead in the fast-paced world of sports apparel. We continuously push boundaries, exploring new technologies and materials to improve performance and comfort. Our design team is dedicated to creating innovative solutions that address the evolving needs of athletes while maintaining our commitment to sustainability.'
        },
        {
            icon: '💗',
            title: 'Ethical Production Practices',
            body: "We believe that ethical production is essential for creating a positive impact on both people and the planet. That's why we partner with manufacturers who share our values and uphold fair labor practices. From ensuring safe working conditions to promoting fair wages, we prioritize the well-being of everyone involved in the production process."
        },
        {
            icon: '👥',
            title: 'Community Engagement',
            body: "Our brand extends beyond just selling products; it's about building a community of like-minded individuals who share a passion for sports and sustainability. We actively engage with our customers through events, partnerships, and initiatives that promote environmental awareness and encourage active lifestyles."
        },
        {
            icon: '🔍',
            title: 'Transparency and Accountability',
            body: "Transparency is fundamental to gaining trust and credibility. We believe in being transparent about our practices, from sourcing materials to manufacturing processes. By openly sharing information with our customers, we empower them to make informed choices and hold us accountable for our actions."
        },
        {
            icon: '🔆',
            title: 'Continuous Improvement',
            body: "We recognize that there's always room for improvement, and we are committed to continuously raising the bar. Whether it's finding new ways to reduce our carbon footprint or incorporating feedback from athletes to enhance product performance, we are dedicated to evolving and innovating for a better future."
        },
    ]
    const partners: Partner[] = [
        {
            name: 'EcoBlend Textiles',
        },
        {
            name: 'GreenGear Manufacturing',
        },
        {
            name: 'EarthWise Apparel',
        },
        {
            name: 'Sustainable Stitch Co.',
        },
        {
            name: 'EarthFit Innovations',
        },
        {
            name: 'GreenThread Collective',
        }
    ]
    const settings = await getData();
   
    
    return (
        <div className='flex flex-col overflow-hidden h-full text-zinc-700'>
            <div className='h-[100px] md:h-[400px]'>
                <Image
                className='w-screen brightness-75'
                src={settings?.image ? settings.image : VerticalBannerPlaceholder}
                alt="About Us Image"
                />
            </div>
            <div className="bg-gradient-to-br from-zinc-200 via-zinc-200 to-zinc-300 z-[1] flex flex-col justify-evenly mx-auto my-4 px-2">
                {values && 
                <div className="flex flex-col md:p-5 first:mt-0 border-b-2 border-zinc-400 last:border-b-0 text-zinc-700">
                    <span 
                    className="text-xl uppercase font-bold underline underline-offset-4 decoration-zinc-400 self-center">
                        Our Values
                    </span>
                    <ul className="grid md:grid-cols-2 gap-2 mt-3 self-center">
                    {values.map((value: Value) => (
                        <li key={value.title}>
                            <div 
                            className="flex flex-col cursor-default w-[90vw] sm:w-[500px] sm:h-[250px] p-4 border-2 border-zinc-400 hover:border-zinc-500">
                                <div className="text-xl border-b border-zinc-400 uppercase">
                                    {value.icon} {value.title}
                                </div>
                                <div className="m-auto">
                                    {value.body}
                                </div>
                            </div>
                        </li>
                    ))}
                    </ul>
                </div>}
                {partners && 
                <div className="flex flex-col md:p-5 first:mt-0 border-b-2 border-zinc-400 last:border-b-0 text-zinc-700">
                    <span 
                    className="text-xl uppercase font-bold underline underline-offset-4 decoration-zinc-400 self-center">
                        Our Partners
                    </span>
                    <ul className="grid md:grid-cols-2 gap-2 mt-3 self-center">
                    {partners.map((partner: Partner) => (
                        <li key={partner.name}>
                            <Image 
                            className="w-[400px] h-[100px] border-2 border-zinc-400 hover:border-zinc-500" 
                            src={partner.image ? partner.image : VerticalBannerPlaceholder} 
                            alt={partner.name} />
                        </li>
                    ))}
                    </ul>
                </div>}
            </div>
        </div>
    )
}

export default About
