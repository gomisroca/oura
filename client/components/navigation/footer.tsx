import Link from "next/link";
import { Card } from "../ui/card";

interface Link {
    name: string;
    url: string;
}

export default function Footer() {

    let links: Link[] = [
        {
            name: 'Our Vision',
            url: 'about'
        },
        {
            name: 'Disclosure',
            url: 'legal'
        }
    ]

    return (
        <>
        <Card id="sidebar" className="sticky bottom-0 right-0 justify-end w-fit bg-zinc-500/30 hover:border-zinc-100 bg-gradient-to-r from-zinc-400/60 via-transparent to-zinc-400/60 flex flex-row m-2 text-zinc-100 hover:from-unset hover:to-unset">
            {links.map(link => (
                <Link 
                key={link.name} 
                className="text-shadow px-2 text-[0.8rem] cursor-pointer hover:bg-zinc-100/30 drop-shadow-md"
                href={`/${link.url}`}>
                    {link.name.toUpperCase()}
                </Link>
            ))}
        </Card>
        </>
    );
}