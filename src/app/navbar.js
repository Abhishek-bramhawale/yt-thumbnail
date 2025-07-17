"use client";


export default function Navbar(){
    return(
<div className="navbar bg-black shadow-sm">
  <div className="flex-1">
    <a className="btn btn-ghost text-xl">Ytools</a>
  </div>
  <div className="flex-none">
    <ul className="menu menu-horizontal px-1">
      {/* <li><a href="https://github.com/Abhishek-bramhawale/yt-thumbnail" target="_">star on github</a></li> */}
      {/* <img src="img" alt="star on github" href="https://github.com/Abhishek-bramhawale/yt-thumbnail"></img> */}

      <a
              href="https://github.com/Abhishek-bramhawale/yt-thumbnail"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <img
                src="./img.png" 
                alt="Star on GitHub"
                className="w-38 h-9 hover:scale-110 transition-transform duration-200"
              />
            </a>
      
    </ul>
  </div>
</div>
    )

}