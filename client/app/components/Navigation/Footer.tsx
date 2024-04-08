import { useRouter } from "next/navigation";

interface Link {
    name: string;
    url: string;
}

export default function Footer() {
    const { push } = useRouter();

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
        <div id="sidebar" className="flex flex-row w-full bg-zinc-200 text-zinc-700 justify-end">
            <nav>
                <ul className="flex flex-row">
                {links.map(link => (
                    <li 
                    key={link.name} 
                    className="px-2 text-[0.8rem] cursor-pointer hover:text-zinc-800"
                    onClick={() => push(`/${link.url}`)}>
                        {link.name.toUpperCase()}
                    </li>
                ))}
                </ul>
            </nav>
        </div>
        </>
    );
}