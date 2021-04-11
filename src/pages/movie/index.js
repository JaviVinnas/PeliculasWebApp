import { useParams } from 'react-router-dom'

import Shell from '../../components/shell'

export default function Movie() {
    const { id } = useParams()

    return <Shell>
        {id}
    </Shell>
}