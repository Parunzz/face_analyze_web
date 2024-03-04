import React from 'react'
import { SteppedLineTo  } from 'react-lineto';
import LineTo from 'react-lineto';
function Map() {
    return (
        <div>
            <div >
                <div style={{display:'inline'}} className="1">1 FLOOR</div>
                <div style={{display:'inline',marginLeft:'50%'}} className="6">6 FLOOR</div><br /><br /><br /><br />
                <div style={{display:'inline'}} className="2">2 FLOOR</div>
                <div style={{display:'inline',marginLeft:'50%'}} className="3">3 FLOOR</div>
            </div>
            <LineTo  from="1" to="2" delay="0" borderWidth="10px"/>
            <LineTo  from="1" to="3" delay="0"/>
            <LineTo  from="1" to="6" delay="0"/>
            <LineTo  from="2" to="6" delay="0"/>
            <LineTo  from="2" to="3" delay="0"/>
            <LineTo  from="3" to="6" delay="0"/>
        </div>
    )
}

export default Map      