interface Props {
    active: boolean
}
  
function FailurePrompt({ active }: Props) {
    if(active) {
        return (
            <>
                <div className='flex flex-col items-center py-2 
                bg-red-100 text-red-500
                border border-red-400'>
                    <span className='uppercase'>Invalid Credentials</span>
                    <span>Please try again</span>
                </div>
            </>
        )
    }
    return null
}

export default FailurePrompt