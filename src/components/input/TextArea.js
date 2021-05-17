export function TextArea({
                             className = '',

                             ...props
                         }) {
    return <textarea
        className={`rounded-lg outline-none font-medium w-full h-full ${className}`}
        {...props}
    />
}