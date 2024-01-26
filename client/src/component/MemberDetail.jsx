import { useState, useEffect } from 'react';
import Nav from './Nav'
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const MemberDetail = () => {
    const { pid } = useParams();
    const [memberInfo, setMemberInfo] = useState(null);
    const [memberImages, setmemberImages] = useState(null);
    const navigate = useNavigate();
    const fetchMemberDetail = async () => {
        try {
            const response = await fetch('http://localhost:3001/Memberdetail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // cross cross-origin requests.
                credentials: 'include',
                body: JSON.stringify({ pid: pid }),
            });
            if (response.ok) {
                const data = await response.json();
                // console.log(data.MemberDetail[0])
                // console.log(data.Base64Images)
                setMemberInfo(data.MemberDetail[0]);
                setmemberImages(data.Base64Images);
            }
            else {
                console.log("Response Error")
                setMemberInfo(null);
            }

        } catch (error) {
            console.error('Error fetching member detail:', error);
        }
    };
    const RemoveMember = async () => {
        try {
            const response = await fetch('http://localhost:3001/removeMember', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // cross cross-origin requests.
                credentials: 'include',
                body: JSON.stringify({ pid: pid }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                navigate('/Member');
            }
            else {
                console.log("Response Error")
                setMemberInfo(null);
            }

        } catch (error) {
            console.error('Error fetching member detail:', error);
        }
    };

    useEffect(() => {

        fetchMemberDetail();
    }, [pid]); // Fetch member detail whenever pid changes

    return (

        <div>
            <Nav />
            <div>
                {memberInfo ? (
                    <div>
                        <h2>Member Details</h2>
                        <Button onClick={RemoveMember} variant="outlined" color="error">
                            Remove
                        </Button>
                        <p>First Name: {memberInfo.FirstName}</p>
                        <p>Last Name: {memberInfo.LastName}</p>
                        {memberImages && (
                            <div>
                                {/* Display base64-encoded images */}
                                <h2>Images</h2>
                                {Object.keys(memberImages).map((imgPath, index) => (
                                    <div key={index}>
                                        <h3>Image {index + 1}</h3>
                                        <img width={500} src={`data:image/jpeg;base64,${memberImages[imgPath]}`} alt={`Image ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <p>Loading member detail...</p>
                )}
            </div>
        </div>
    )
}

export default MemberDetail