import { useNavigate, useRouteError } from "react-router-dom";

export default function Error() {
    const navigate = useNavigate();
    const error = useRouteError();

    return (
        <div className="flex flex-col items-center text-zinc-700 mt-10">
            {error ?
            <div className="flex flex-col items-center">
                <span>
                    Sorry, an unexpected error has occurred.
                </span>
                <span>
                    <i>{error.statusText || error.message}</i>
                </span>
            </div>
            : 
            <div className="flex flex-col items-center gap-4">
                <div className="text-9xl font-bold">
                    404
                </div>
                <div>
                    We are not too sure how you landed here.
                </div>
            </div>
            }
            <div 
            onClick={() => navigate('/')}
            className='mt-5 px-5 py-2 uppercase w-full block text-center cursor-pointer border border-zinc-400 hover:bg-zinc-300'>
                Go Back
            </div>
        </div>
    );
}