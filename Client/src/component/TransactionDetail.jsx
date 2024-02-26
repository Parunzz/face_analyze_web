import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

export default function TransactionDetail() {
    const { Data_id } = useParams();
    const [FullIMG, setFULLIMG] = useState(null);
    const [CUTIMG, setCUTIMG] = useState(null);
    const fetchDetail = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/TransactionDetail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // cross cross-origin requests.
                credentials: 'include',
                body: JSON.stringify({ Data_id: Data_id }),
            });
            if (response.ok) {
                const data = await response.json();
                
                setCUTIMG(data.Cut_Img)
                setFULLIMG(data.Full_Img)
            }
        } catch (error) {
            console.error('Error fetching member detail:', error);

        }
    }
    useEffect(() => {
        fetchDetail();
    }, [Data_id]); // Fetch member detail whenever pid changes

    return (
        <div>
            TransactionDetail + {Data_id}
            <img src={`data:image/jpeg;base64, ${FullIMG}`} alt="Full Image" />
            <img src={`data:image/jpeg;base64, ${CUTIMG}`} alt="Full Image" />
        </div>
    )
}
