import React from 'react'
import './NavBar.css'

const NavBar = ({page}) => {
  return (
    <nav>ポケモン図鑑 {page}ページ目</nav>
  )
}

export default NavBar