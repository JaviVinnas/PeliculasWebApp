export default function Input({
                                  name = '',
                                  type = 'text',
                                  before: BeforeIcon = null,
                                  after: AfterIcon = null,
                                  label = '',
                                  errors = false,
                                  classname = ''
                              }) {
    return <label className = {`block text-sm font-bold mb-4 ${classname}`}>
        {label}
        <p className = { `mt-2 relative w-full rounded bg-teal-700 bg-opacity-20
                          focus-within:bg-yellow-700 focus-within:bg-opacity-20
                          ${errors ? 'ring ring-red-500' : ''}`
        }>
            { BeforeIcon !== null ? <BeforeIcon className = 'absolute top-4 left-0 w-4 mx-4'/> : null }
            <input type = { type }
                   name = { name }
                   className = {`rounded outline-none bg-transparent h-12 w-full 
                                 ${ BeforeIcon !== null ? 'pl-12' : 'pl-4'}
                                 ${ AfterIcon !== null ? 'pr-12' : 'pr-4'}
                                 focus:ring focus:ring-yellow-500`}
            />
            { AfterIcon !== null ? <AfterIcon className = 'absolute top-4 left-0 w-4 mx-4'/> : null }
        </p>
    </label>

}