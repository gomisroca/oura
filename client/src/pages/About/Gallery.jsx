import React from "react";
import axios from "axios";
import dummy from '../../assets/dummy.png';

export default function Gallery(props) {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/' + props.type).then((response) => {
      let res = response.data.slice(0,10);
      setData(res);
    });
  }, []);
  if (!data) return null;
  
  return (
      <div className="flex flex-col p-5 first:mt-0 border-b-2 border-black/20 last:border-b-0">
        <span className="text-xl uppercase font-bold underline underline-offset-4 decoration-black/30 self-center">{props.title}</span>
        <ul className="columns-2 mt-3 self-center">
          {data.map(data => (
            <li key={data.id}>
              {data.url ?
                <img className="w-[400px] h-[100px] mb-2 border-2 border-black/10 hover:bg-black/10" src={data.url} />
                : data.name ?
                <div className="cursor-default flex mb-2 text-justify text-lg border-2 border-black/10 hover:bg-black/10">
                  <img src={dummy} className="w-[75px] h-[100px]"/>
                  <span className="px-3 self-center">{data.name}</span>
                </div>
                : 
                <div className="cursor-default w-[500px] h-[150px] px-4 mb-2 py-2 text-justify border-2 border-black/10 hover:bg-black/10">
                  <div className="text-xl">
                    {data.title}
                  </div>
                  <div className=" mx-1 text-black/70">
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