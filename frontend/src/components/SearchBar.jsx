import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';
const SearchBar = () => {

   const {search, setSearch, showSearch, setShowSearch} = useContext(ShopContext);
   const location = useLocation();
   const isCollectionPage = location.pathname === '/collection';

  return showSearch && isCollectionPage ? (
    <div className='border-t border-b bg-gray-50 text-center'>
      <form
        onSubmit={(event) => event.preventDefault()}
        className='inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2'
        role='search'
      >
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className='flex-1 outline-none bg-inherit text-sm'
          type='search'
          placeholder='Search products'
          aria-label='Search products'
          autoFocus
        />
        <button type='submit' className='cursor-pointer' aria-label='Apply product search'>
          <img className='w-4' src={assets.search_icon} alt='' />
        </button>
      </form>
      <button
        type='button'
        onClick={() => {
          setSearch('');
          setShowSearch(false);
        }}
        className='inline cursor-pointer'
        aria-label='Close product search'
      >
        <img className='w-3' src={assets.cross_icon} alt='' />
      </button>
    </div>
  ) : null
}

export default SearchBar
