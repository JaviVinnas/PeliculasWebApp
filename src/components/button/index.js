export default function Button({type, children, className = '', ...props}) {
    return <input
        type = {type || 'button'}
        value = { children }
        className = { `mt-8 font-bold p-4 text-white rounded shadow transition outline-none bg-gradient-to-br from-green-400 via-teal-500 to-blue-500
                       focus:ring focus:ring-offset-2 focus:ring-pink-500 focus:bg-gradient-to-br focus:from-pink-500 focus:via-red-500 focus:to-yellow-500 
                       hover:bg-gradient-to-br hover:from-pink-500 hover:via-red-500 hover:to-yellow-500
                       ${className}` }
        { ...props }
    />
}