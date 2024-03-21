import React, {useEffect, useState} from 'react'
import { Card, Toast, Button } from 'antd-mobile'
import './coffee.css'
import { UilHeart, UilStar } from '@iconscout/react-unicons'

export default function Coffee({i,filter}) {
    const [style,setStyle]=useState('icon')
    const change=()=>{
        switch (style) {
            case 'icon':
                let count = Number(localStorage.getItem('length'))+1
                localStorage.setItem('length',count)
                localStorage.setItem(`save${count}`,i)
                console.log(count)
                setStyle('icons');
                break;
            case 'icons':
                let num = Number(localStorage.getItem('length'))-1
                localStorage.setItem('length',num)
                console.log(num)
                setStyle('icon');
                break;
            default:
                break;
        }
    }

    return (
        <Card
            title={
                <div className='like' onClick={change}>
                    <UilHeart className={style}/>
                </div>
            }
            style={{ borderRadius: '16px',borderColor:"black",width:"48%",marginBottom:"1rem"}}
        >
            <img src={i} alt="" style={{width:"50rem",height:"5rem",margin:"0 auto",objectFit:"cover",objectPosition:"30% 10%",filter: `${filter}`}}/>
            <div onClick={e => e.stopPropagation()}>
                <div style={{display:"flex",flexDirection:"row",alignItems:"center",backgroundColor:"white",justifyContent:"space-around",width:"80%",borderRadius:"25px",height:"2rem",marginTop:".5rem"}}>
                    <div style={{marginTop:"-.5rem"}} onClick={()=>localStorage.setItem('filter',filter)}><h6>use it</h6></div>
                </div>
            </div>
        </Card>
    );
}
