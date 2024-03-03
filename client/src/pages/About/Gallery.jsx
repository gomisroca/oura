import { useEffect, useState } from "react";
import axios from "axios";
import dummy from '../../assets/dummy.png';

export default function Gallery(props) {
    const [data, setData] = useState(null);
    
    useEffect(() => {
        axios.get('https://jsonplaceholder.typicode.com/' + props.type)
        .then((response) => {
            let res = response.data.slice(0,10);
            setData(res);
            })
        .catch(error => {
            if(error.response){
                console.log(error.response)
            } else if(error.request){
                console.log(error.request)
            } else{
                console.log(error.message)
            }
        })
    }, []);

    if (!data) return null;
    
    return (
        <div className="flex flex-col p-5 first:mt-0 border-b-2 border-zinc-400 last:border-b-0 text-zinc-700">
            <span 
            className="text-xl uppercase font-bold underline underline-offset-4 decoration-zinc-400 self-center">
                {props.title}
            </span>
            <ul className="columns-2 mt-3 self-center">
            {data.map(data => (
                <li key={data.id}>
                {data.url ?
                    <img 
                    className="w-[400px] h-[100px] mb-2 border-2 border-zinc-400 hover:border-zinc-500" 
                    src={data.url} />
                : data.name ?
                    <div 
                    className="cursor-default flex mb-2 text-justify text-lg border-2 border-zinc-400 hover:border-zinc-500">
                        <img
                        className="w-[75px] h-[100px]"
                        src={dummy}/>
                        <span className="px-3 self-center">{data.name}</span>
                    </div>
                : 
                    <div 
                    className="cursor-default w-[500px] h-[150px] px-4 mb-2 py-2 text-justify border-2 border-zinc-400 hover:border-zinc-500">
                        <div className="text-xl">
                            {data.title}
                        </div>
                        <div className="mx-1">
                            {data.body}
                        </div>
                    </div>
                    }
                </li>
            ))}
            </ul>
        </div>
    );
}