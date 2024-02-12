import '../css/Home.css';
import { useState, useRef } from 'react';
import vdoBg from '../assets/video/Kiosk.mp4';

function Home() {

  const webRef = useRef(null);
  const showImage = () => {
    console.log(webRef.current.getScreenshot());
  }

  return (
    <div className='Homepage'>
      <div className='video-section'>
            <div className='video'>
              <div className='shadow'></div>
              <video src={vdoBg} autoPlay loop muted/>
            </div>
          </div><br /><br /><br /><br /><br />
           <div className='Introduce-section'>
              <h3 id="Head-text" className='text-3xl font-bold title	'>What is Analyze Company</h3><br />
              <p id="Inform-text" className='paragraph text-xl'>
                บริษัท Analyze เป็นผู้นำด้านนวัตกรรมและเทคโนโลยีที่ตั้งคติที่จะเปลี่ยนแปลงโลกด้วยการใช้ประโยชน์จากปัญญาประดิษฐ์ 
                (Artificial Intelligence: AI) ให้กับสังคมและธุรกิจต่างๆ ทั่วโลก <br />ด้วยการนำเสนอและพัฒนาเทคโนโลยี AI ที่
                โดดเด่นและมีประสิทธิภาพสูง บริษัท Analyze ได้เป็นส่วนสำคัญในการสร้างความสะดวกสบายให้แก่คนทั่วโลกผ่านการปรับใช้ 
                AI ในหลากหลายด้าน<br />ด้วยความคิดสร้างสรรค์และการพัฒนาที่ไม่หยุดยั้ง
              </p>
              <div className='img-section'>
                <img src ='/img/1.png' className='img-1'></img><br /><br />
                {/* <img src='/img/1.png' className='img-1'></img> */}
              </div>
          </div>
          
    </div>
  );
}

export default Home;
