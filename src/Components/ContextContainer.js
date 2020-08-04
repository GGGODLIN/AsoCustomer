import React, { useContext } from 'react'
import { Routers } from '../Routers/Routers'
import { Context } from '../Store/store'
import { MenuBar } from '../Components/MenuBar'
import { JumpAlert } from './JumpAlerts'
import { Portal } from './Portal'
import { LoginCard } from '../Components/LoginCard'

/* 
   Date   : 2020-06-09 14:40:41
   Author : Arhua Ho
   Content: 需要一層轉發Context
*/
export const ContextContainer = (props) => {

  const { Theme, setTheme, OpwnLoginCard, setOpwnLoginCard } = useContext(Context);
  //const { } = Theme;

  return (
    <>
      {/* 
              Date   : 2020-06-12 12:18:46
              Author : Arhua Ho
              Content: 不隨Router 卸載、掛載的組件
            */}
      <MenuBar />
      <JumpAlert />
      <Portal />
      {OpwnLoginCard && <LoginCard close={() => { setOpwnLoginCard(false) }}></LoginCard>}
      {/* 
              Date   : 2020-06-12 12:18:46
              Author : Arhua Ho
              Content: 寫死的路由
            */}
      <Routers />
    </>
  )
}