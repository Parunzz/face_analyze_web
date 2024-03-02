import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import "../css/Historydetail.css"

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
                console.log(data)
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
        <div class = "mybackground">
        <div class = "historypicture">
            <h1>Transaction Detail</h1>
            <div class = "img1">
            <img src={`data:image/jpeg;base64, ${FullIMG}`} alt="Full Image" />
            </div>
            <div class = "img2">
            <img src={`data:image/jpeg;base64, ${CUTIMG}`} alt="Full Image" />
            </div>
     
        </div>
        </div>
    )
}
