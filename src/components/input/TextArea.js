export function TextArea({
                             label = '',
    ...props
                         }){
    return <label className = {`block text-sm font-bold space-y-2`}>
        { label !== '' ? <span>{label}</span> : null }
        <textarea
               className = {`rounded outline-none h-12 w-full font-medium`}
               { ...props }
        />
    </label>
}