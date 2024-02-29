import React from "react";
import { Link } from "react-router-dom";
import UserMenu from "./UserMenu/index";
import Menu from '@mui/material/Menu';
import axios from 'axios';

export default function NavMenu() {
  const [menuEl, setMenuEl] = React.useState(null);
  const openMenu = Boolean(menuEl);
  const handleMenu = (event) => {
      setMenuEl(event.currentTarget);
  };
  const handleMenuClose = () => {
      setMenuEl(null);
  };

  const [menuEl2, setMenuEl2] = React.useState(null);
  const openMenu2 = Boolean(menuEl2);
  const handleMenu2 = (event) => {
      setMenuEl2(event.currentTarget);
  };
  const handleMenuClose2 = () => {
      setMenuEl2(null);
  };

  const [maleMenuEl, setMaleMenuEl] = React.useState(null);
  const [maleMenuKey, setMaleMenuKey] = React.useState(null);
  const openMaleMenu = Boolean(maleMenuEl);
  const handleMaleMenu = (event, key) => {
    setMaleMenuKey(key)
    setMaleMenuEl(event.currentTarget);
  };
  const handleMaleMenuClose = () => {
    setMaleMenuEl(null);
  };

  const [femaleMenuEl, setFemaleMenuEl] = React.useState(null);
  const [femaleMenuKey, setFemaleMenuKey] = React.useState(null);
  const openFemaleMenu = Boolean(femaleMenuEl);
  const handleFemaleMenu = (event, key) => {
    setFemaleMenuKey(key)
    setFemaleMenuEl(event.currentTarget);
  };
  const handleFemaleMenuClose = () => {
    setFemaleMenuEl(null);
  };

  const [man, setMan] = React.useState([]);
  const [woman, setWoman] = React.useState([]);
  React.useEffect(() => {
    axios.get('http://localhost:4030/categories/catalog').then((res) => {
      let manFilter = (res.data).find(x => x.genre == 'man');
      let manArray = manFilter.classes;
      setMan(manArray);
      
      let womanFilter = (res.data).find(x => x.genre == 'woman');
      let womanArray = womanFilter.classes;
      setWoman(womanArray);
    })
  }, []);

  return (
    <>
      <div id="sidebar" className="text-gray-700 flex flex-row w-full bg-white drop-shadow">
        <div className="px-2">
          <Link className="font-semibold subpixel-antialiased text-[1.2rem]" to={''}>OURA</Link>
        </div>
        <nav className="my-auto">
          <ul className="flex flex-row">
            <div
              className='hover:bg-black/10 px-2 cursor-pointer ml-2'
              aria-controls={openMenu ? 'male-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openMenu ? 'true' : undefined}
              onClick={handleMenu}
            >
              MEN
            </div>
            <Menu
              PaperProps={{ sx: { borderRadius: 0 } }}
              MenuListProps={{ sx: { py: 0 } }}
              id="male-menu"
              anchorEl={menuEl}
              open={openMenu}
              onClose={handleMenuClose}
            >
              <div className="flex flex-col">
                <Link className="p-2 border-b-2 border-green-500/20 bg-green-200 hover:bg-green-300" to={'man/season'}>
                  <div>
                    <span className="uppercase text-sm">Season</span>
                  </div>
                </Link>
                <Link className="p-2 border-b-2 border-black/20 hover:bg-black/10" to={'man'}>
                  <div>
                    <span className="uppercase text-sm">All</span>
                  </div>
                </Link>
              {man.map((key) => {
                return(
                  <div key={key.id}>
                    <div   
                    className='hover:bg-black/10 cursor-pointer p-2 border-b-2 border-black/20'
                    aria-controls={openMaleMenu ? key.name : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMaleMenu ? 'true' : undefined}
                    onClick={(event) => handleMaleMenu(event, key.name)}
                    >
                      <span className="uppercase text-sm">{key.name}</span>
                    </div>
                    <Menu
                      PaperProps={{ sx: { borderRadius: 0 } }}
                      MenuListProps={{ sx: { py: 0 } }}
                      id={key.name}
                      anchorEl={maleMenuEl}
                      open={openMaleMenu && maleMenuKey === key.name}
                      onClose={handleMaleMenuClose}
                      anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'center',
                        horizontal: 'left',
                      }}
                    >
                      <div className="flex flex-col">
                        <Link className="p-2 border-b-2 border-black/20 hover:bg-black/10" to={'man/' + key['name']}>
                            <div>
                              <span className="uppercase text-sm">All</span>
                            </div>
                        </Link>
                        {key.types.map((type, index) => (
                          <Link key={index} className="p-2 border-b-2 border-black/20 hover:bg-black/10" to={'man/' + key['name'] + '/' + type}>
                            <div key={index}>
                              <span className="uppercase text-sm">{type}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </Menu>
                  </div>
                )
              })}
              </div>
            </Menu>
            <hr />
            <div
              className='hover:bg-black/10 px-2 cursor-pointer ml-2'
              aria-controls={openMenu2 ? 'female-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openMenu2 ? 'true' : undefined}
              onClick={handleMenu2}
            >
              WOMEN
            </div>
            <Menu
              PaperProps={{ sx: {borderRadius: 0} }}
              MenuListProps={{ sx: { py: 0 } }}
              id="female-menu"
              anchorEl={menuEl2}
              open={openMenu2}
              onClose={handleMenuClose2}
            >
               <div className="flex flex-col">
                <Link className="p-2 border-b-2 border-green-500/20 bg-green-200 hover:bg-green-300" to={'woman/season'}>
                  <div>
                    <span className="uppercase text-sm">Season</span>
                  </div>
                </Link>
                <Link className="p-2 border-b-2 border-black/20 hover:bg-black/10" to={'woman'}>
                  <div>
                    <span className="uppercase text-sm">All</span>
                  </div>
                </Link>
              {woman.map((key) => {
                return(
                  <div key={key.id}>
                    <div   
                    className='hover:bg-black/10 cursor-pointer p-2 border-b-2 border-black/20'
                    aria-controls={openFemaleMenu ? key.name : undefined}
                    aria-haspopup="true"
                    aria-expanded={openFemaleMenu ? 'true' : undefined}
                    onClick={(event) => handleFemaleMenu(event, key.name)}
                    >
                      <span className="uppercase text-sm">{key.name}</span>
                    </div>
                    <Menu
                      PaperProps={{ sx: {borderRadius: 0} }}
                      MenuListProps={{ sx: { py: 0 } }}
                      id={key.name}
                      anchorEl={femaleMenuEl}
                      open={openFemaleMenu && femaleMenuKey === key.name}
                      onClose={handleFemaleMenuClose}
                      anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'center',
                        horizontal: 'left',
                      }}
                    >
                      <div className="flex flex-col">
                        <Link className="p-2 border-b-2 border-black/20 hover:bg-black/10" to={'woman/' + key['name']}>
                          <div>
                            <span className="uppercase text-sm">All</span>
                          </div>
                        </Link>
                        {key.types.map((type, index) => (
                          <Link key={index} className="p-2 border-b-2 border-black/20 hover:bg-black/10" to={'woman/' + key['name'] + '/' + type}>
                            <div key={index}>
                              <span className="uppercase text-sm">{type}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </Menu>
                  </div>
                )
              })}
              
              </div>
            </Menu>
          </ul>
        </nav>
        <div className="absolute right-0 self-center">
          <UserMenu />
        </div>
      </div>
    </>
  );
}