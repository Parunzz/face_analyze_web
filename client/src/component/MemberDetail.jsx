import React from 'react'
import Nav from './Nav'
import { useParams } from 'react-router-dom';

const MemberDetail = () => {
    const { pid } = useParams();

    return (

        <div>
            <Nav />
            <h1>Member Details</h1>
            <p>Member ID: {pid}</p>
        </div>
    )
}

export default MemberDetail