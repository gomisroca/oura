import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  let links = [
    {
        name: 'Our Vision',
        url: 'about'
    },
    {
        name: 'Work with Us',
        url: 'work'
    },
    {
        name: 'Legal Disclosure',
        url: 'legal'
    }
  ]

  return (
    <>
      <div id="sidebar" className="text-gray-700 flex flex-row w-full bg-white drop-shadow justify-end">
        <nav>
          <ul className="flex flex-row">
            {links.map(link => (
              <li key={link.name} className="hover:bg-black/10 px-2 text-[0.8rem]">
                <Link to={`/${link.url}`}>{link.name.toUpperCase()}</Link>
                <hr />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}