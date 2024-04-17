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
            name: 'Legal Disclosure',
            url: 'legal'
        }
    ]

    return (
        <>
        <Card id="sidebar" className="relative justify-end w-fit bg-zinc-500/30 border-zinc-400 bg-gradient-to-r from-zinc-400/60 via-transparent to-zinc-400/60 flex flex-row m-2 text-zinc-100 hover:from-unset hover:to-unset hover:border-zinc-500/30">
            <nav>
                <ul className="flex flex-row">
                {links.map(link => (
                    <Link 
                    key={link.name} 
                    className="px-2 text-[0.8rem] cursor-pointer hover:bg-zinc-100/30 drop-shadow-md rounded-md"
                    href={`/${link.url}`}>
                        {link.name.toUpperCase()}
                    </Link>
                ))}
                </ul>
            </nav>
        </Card>
        </>
    );
}