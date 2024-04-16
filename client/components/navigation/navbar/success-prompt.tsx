interface Props {
    active: boolean
}
  
function SuccessPrompt({ active }: Props) {
    if(active) {
        return (
            <>
                <div className='flex flex-col items-center py-2 
                bg-green-100 text-green-500
                border border-green-400'>
                    <span className='uppercase'>Success!</span>
                    <span>You can go back.</span>
                </div>
            </>
        )
    }
    return null
}

export default SuccessPrompt